package base

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func RunScript(script string, args ...string) (string, error) {
	out, err := exec.Command(script, args...).CombinedOutput()
	return string(out), err
}

func GetUsername(w http.ResponseWriter, r *http.Request) (string, bool) {
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "missing username", http.StatusBadRequest)
		return "", false
	}
	return username, true
}

func Execute(w http.ResponseWriter, envKey string, args ...string) {
	path := GetEnvOrFail(envKey)
	out, err := RunScript(path, args...)
	if err != nil {
		message := out
		if out == "" {
			message = err.Error()
		}
		http.Error(w, message, http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, out)
}

func ServeClientFile(w http.ResponseWriter, r *http.Request, dirEnv, relPath, contentType, downloadName string) {
	baseDir := GetEnvOrFail(dirEnv)
	filePath := filepath.Join(baseDir, relPath)
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		http.Error(w, "Invalid path "+err.Error(), http.StatusInternalServerError)
		return
	}
	if _, err := os.Stat(absPath); err != nil {
		if os.IsNotExist(err) {
			http.Error(w, "File "+absPath+" not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set(
		"Content-Disposition",
		fmt.Sprintf(`attachment; filename="%s"`, downloadName),
	)
	http.ServeFile(w, r, absPath)
}

func GetEnvOrFail(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Env variable %s is required", key)
	}
	return val
}

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if r.URL.RawQuery != "" {
			path += "?" + r.URL.RawQuery
		}

		log.Printf("%s %s", r.Method, path)
		next.ServeHTTP(w, r)
	})
}

func Auth(next http.Handler) http.Handler {
	token := GetEnvOrFail("SERVICE_TOKEN")
	cookieName := GetEnvOrFail("COOKIE_NAME")
	secret := []byte(GetEnvOrFail("JWT_SECRET"))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(cookieName)
		if err == nil && ValidJWT(cookie.Value, secret) {
			next.ServeHTTP(w, r)
			return
		}
		if r.Header.Get("Authorization") == token {
			next.ServeHTTP(w, r)
			return
		}
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	})
}

func ValidJWT(token string, secret []byte) bool {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return false
	}

	headerJSON, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}
	var header struct {
		Alg string `json:"alg"`
	}
	if err := json.Unmarshal(headerJSON, &header); err != nil {
		return false
	}
	if header.Alg != "HS256" {
		return false
	}

	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(parts[0] + "." + parts[1]))
	want := mac.Sum(nil)
	sig, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return false
	}
	if subtle.ConstantTimeCompare(sig, want) != 1 {
		return false
	}

	payloadJSON, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}
	var claims struct {
		Exp int64 `json:"exp"`
	}
	if err := json.Unmarshal(payloadJSON, &claims); err != nil {
		return false
	}
	return claims.Exp > time.Now().Unix()
}

func Serve(defaultPort string, handler http.Handler) {
	portEnv := os.Getenv("PORT")
	port := defaultPort
	keyPath := "/etc/ssl/certs/api/key.pem"
	certPath := "/etc/ssl/certs/api/cert.pem"
	appEnv := os.Getenv("APP_ENV")
	keyEnv := os.Getenv("KEY_PATH")
	certEnv := os.Getenv("CERT_PATH")
	if portEnv != "" {
		port = portEnv
	}
	if keyEnv != "" {
		keyPath = keyEnv
	}
	if certEnv != "" {
		certPath = certEnv
	}
	if appEnv == "local" {
		log.Fatal(http.ListenAndServe(":"+port, handler))
	} else {
		log.Fatal(http.ListenAndServeTLS(":"+port, certPath, keyPath, handler))
	}
	log.Println("Server started on", port)
}

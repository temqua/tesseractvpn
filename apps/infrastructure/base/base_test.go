package base

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"testing"
	"time"
)

func signHS256(secret []byte, header, payload string) string {
	signing := base64.RawURLEncoding.EncodeToString([]byte(header)) + "." + base64.RawURLEncoding.EncodeToString([]byte(payload))
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(signing))
	return signing + "." + base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func makeClaims(exp int64) string {
	return fmt.Sprintf(`{"sub":"test","username":"user","exp":%d}`, exp)
}

func TestValidJWT(t *testing.T) {
	secret := []byte("test-secret")
	header := `{"alg":"HS256","typ":"JWT"}`
	future := time.Now().Add(time.Hour).Unix()

	t.Run("valid", func(t *testing.T) {
		token := signHS256(secret, header, makeClaims(future))
		if !ValidJWT(token, secret) {
			t.Fatal("expected valid token to pass")
		}
	})

	t.Run("wrong secret", func(t *testing.T) {
		token := signHS256(secret, header, makeClaims(future))
		if ValidJWT(token, []byte("other-secret")) {
			t.Fatal("expected token signed with different secret to fail")
		}
	})

	t.Run("tampered payload", func(t *testing.T) {
		token := signHS256(secret, header, makeClaims(future))
		parts := tokenParts(token)
		tampered := parts[0] + "." + base64.RawURLEncoding.EncodeToString([]byte(makeClaims(future-3600))) + "." + parts[2]
		if ValidJWT(tampered, secret) {
			t.Fatal("expected tampered payload to fail")
		}
	})

	t.Run("expired", func(t *testing.T) {
		past := time.Now().Add(-time.Hour).Unix()
		token := signHS256(secret, header, makeClaims(past))
		if ValidJWT(token, secret) {
			t.Fatal("expected expired token to fail")
		}
	})

	t.Run("wrong alg", func(t *testing.T) {
		token := signHS256(secret, `{"alg":"none","typ":"JWT"}`, makeClaims(future))
		if ValidJWT(token, secret) {
			t.Fatal("expected alg none to fail")
		}
	})

	t.Run("malformed", func(t *testing.T) {
		for _, token := range []string{"", "a.b", "a.b.c.d", "notajwt"} {
			if ValidJWT(token, secret) {
				t.Fatalf("expected malformed token %q to fail", token)
			}
		}
	})
}

func tokenParts(token string) []string {
	dst := make([]string, 3)
	start := 0
	for i := 0; i < 2; i++ {
		for j := start; j < len(token); j++ {
			if token[j] == '.' {
				dst[i] = token[start:j]
				start = j + 1
				break
			}
		}
	}
	dst[2] = token[start:]
	return dst
}
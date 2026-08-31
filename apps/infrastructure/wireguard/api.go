package main

import (
	"fmt"
	"net/http"
	"path/filepath"

	"tesseractvpn/infrastructure/base"
)

func createHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.Execute(w, "CREATE_PATH", username)
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.Execute(w, "DELETE_PATH", username)
}

func listHandler(w http.ResponseWriter, r *http.Request) {
	base.Execute(w, "LIST_PATH")
}

func pauseHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.Execute(w, "PAUSE_PATH", username)
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.ServeClientFile(
		w, r,
		"WG_CLIENTS_DIR",
		filepath.Join(username, username+".conf"),
		"application/octet-stream",
		username+".conf",
	)
}

func qrHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.ServeClientFile(
		w, r,
		"WG_CLIENTS_DIR",
		filepath.Join(username, username+".png"),
		"application/png",
		username+".png",
	)
}

func main() {
	http.HandleFunc("/create", createHandler)
	http.HandleFunc("/delete", deleteHandler)
	http.HandleFunc("/list", listHandler)
	http.HandleFunc("/pause", pauseHandler)
	http.HandleFunc("/file", fileHandler)
	http.HandleFunc("/qr", qrHandler)
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "PONG")
	})

	var handler http.Handler = http.DefaultServeMux
	handler = base.Logging(handler)
	handler = base.Auth(handler)

	base.Serve("8091", handler)
}
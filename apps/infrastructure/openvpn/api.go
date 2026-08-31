package main

import (
	"fmt"
	"net/http"

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

func exportHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.Execute(w, "EXPORT_PATH", username)
}

func listHandler(w http.ResponseWriter, r *http.Request) {
	base.Execute(w, "LIST_PATH")
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	username, ok := base.GetUsername(w, r)
	if !ok {
		return
	}
	base.ServeClientFile(
		w, r,
		"OVPN_CLIENTS_DIR",
		username+".ovpn",
		"application/x-openvpn-profile",
		username+".ovpn",
	)
}

func main() {
	http.HandleFunc("/create", createHandler)
	http.HandleFunc("/delete", deleteHandler)
	http.HandleFunc("/export", exportHandler)
	http.HandleFunc("/list", listHandler)
	http.HandleFunc("/file", fileHandler)
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "PONG")
	})

	var handler http.Handler = http.DefaultServeMux
	handler = base.Logging(handler)
	handler = base.Auth(handler)

	base.Serve("8092", handler)
}
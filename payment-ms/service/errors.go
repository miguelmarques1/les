package service

import "errors"

var (
	ErrMaxAttemptsReached = errors.New("número máximo de tentativas atingido")
)

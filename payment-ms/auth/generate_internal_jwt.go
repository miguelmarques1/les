package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateInternalJWT() (string, error) {
	secret := []byte(os.Getenv("INTERNAL_JWT_SECRET"))

	claims := jwt.MapClaims{
		"iss":  "payment-ms",
		"aud":  "backend",
		"role": "admin",
		"exp":  time.Now().Add(5 * time.Minute).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

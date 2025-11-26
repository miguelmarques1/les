"use client";

import { useState, useEffect } from "react";
import type { CardModel } from "../models/card-model";
import { cardService } from "../services";
import { useAuth } from "../contexts/auth-context";

export function useCards() {
  const { isAuthenticated } = useAuth();
  const [cards, setCards] = useState<CardModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    if (!isAuthenticated) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await cardService.getCards();
      setCards(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
      setError("Falha ao carregar os cartões");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [isAuthenticated]);

  const createCard = async (
    number: string,
    holderName: string,
    expiryDate: string,
    brandId: number,
    cvv: string
  ) => {
    setIsLoading(true);
    try {
      const newCard = await cardService.createCard(
        number,
        holderName,
        expiryDate,
        brandId,
        cvv
      );
      setCards([...cards, newCard]);
      fetchCards();
      return newCard;
    } catch (err) {
      console.error("Failed to create card:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: number) => {
    setIsLoading(true);
    try {
      await cardService.deleteCard(id);
      setCards(cards.filter((card) => card.id !== id));
      fetchCards();
    } catch (err) {
      console.error("Failed to delete card:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { cards, isLoading, error, createCard, deleteCard, fetchCards };
}

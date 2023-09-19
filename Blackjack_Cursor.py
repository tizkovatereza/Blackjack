import random

class Card:
    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

    def __repr__(self):
        return f"{self.value} of {self.suit}"

class Deck:
    def __init__(self):
        self.cards = [Card(s, v) for s in ["Spades", "Clubs", "Hearts", "Diamonds"] for v in ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]]

    def shuffle(self):
        if len(self.cards) > 1:
            random.shuffle(self.cards)

    def deal(self):
        if len(self.cards) > 1:
            return self.cards.pop(0)

class Hand:
    def __init__(self, dealer=False):
        self.dealer = dealer
        self.cards = []
        self.value = 0

    def add_card(self, card):
        self.cards.append(card)

    def calculate_value(self):
        self.value = 0
        has_ace = False
        for card in self.cards:
            if card.value.isnumeric():
                self.value += int(card.value)
            else:
                if card.value == "A":
                    has_ace = True
                    self.value += 11
                else:
                    self.value += 10

        if has_ace and self.value > 21:
            self.value -= 10

    def get_value(self):
        self.calculate_value()
        return self.value

class Game:
    def __init__(self):
        pass

    def play(self):
        playing = True

        while playing:
            self.deck = Deck()
            self.deck.shuffle()

            self.player_hand = Hand()
            self.dealer_hand = Hand(dealer=True)

            for i in range(2):
                self.player_hand.add_card(self.deck.deal())
                self.dealer_hand.add_card(self.deck.deal())

            print("Welcome to Blackjack!")
            print("The dealer is showing a " + str(self.dealer_hand.cards[1]))
            print("You have a total of " + str(self.player_hand.get_value()) + " from the cards " + str(self.player_hand.cards))
            blackjack = False

            if self.player_hand.get_value() == 21:
                print("Blackjack! You win!")
                playing = False
                blackjack = True

            while not blackjack:
                choice = input("Would you like to [H]it, [S]tand, or [Q]uit: ").lower()
                while choice not in ["h", "s", "q"]:
                    choice = input("Please enter 'h', 's', or 'q': ").lower()
                if choice == "h":
                    self.player_hand.add_card(self.deck.deal())
                    print("You now have a total of " + str(self.player_hand.get_value()) + " from the cards " + str(self.player_hand.cards))
                    if self.player_hand.get_value() > 21:
                        print("You have busted! You lose!")
                        playing = False
                elif choice == "s":
                    while self.dealer_hand.get_value() < 17:
                        self.dealer_hand.add_card(self.deck.deal())
                    if self.dealer_hand.get_value() > 21:
                        print("The dealer has busted! You win!")
                    elif self.dealer_hand.get_value() < self.player_hand.get_value():
                        print("You beat the dealer! You win!")
                    else:
                        print("The dealer has beaten you! You lose!")
                    playing = False
                elif choice == "q":
                    print("Thank you for playing!")
                    playing = False

         

#Simple blackjack game

import random #Importing a module for picking a random card

card_categories = ['Hearts', 'Diamonds', 'Spades', 'Clubs'] #List of card categories
cards_list = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10','Jack', 'Queen', 'King'] #List of card values

deck = [(card,category) for card in cards_list for category in card_categories] #Creating a deck of cards)]

def card_value(card):
    if card[0] in ['Jack', 'Queen', 'King']:
        return 10
    elif card[0] == 'Ace':
        return 11
    else:
        return int(card[0])
    

random.shuffle(deck) #Shuffling the deck
player_card = [deck.pop(), deck.pop()] #Picking two cards for the player
dealer_card = [deck.pop(), deck.pop()] #Picking two cards for the dealer

while True:
    player_score = sum(card_value(card) for card in player_card) #Calculating the player's score
    dealer_score = sum(card_value(card) for card in dealer_card) #Calculating the dealer's score
    print(f"Your cards are {player_card} and your score is {player_score}") #Printing the player's cards and score
    print(f"The dealer's first card is {dealer_card[0]}") #Printing the dealer's first card
    print("\n") #Printing a new line
    choice = input("Do you want to hit or stand? (h/s): ") #Asking the player if they want to hit or stand
    if choice == 'h': #If the player chooses to hit
        player_card.append(deck.pop()) #The player gets a new card
        if player_score > 21: #If the player's score is over 21
            print(f"Your cards are {player_card} and your score is {player_score}") #Printing the player's cards and score
            print(f"The dealer's cards are {dealer_card} and their score is {dealer_score}") #Printing the dealer's cards and score
            print("You lose!") #Printing that the player loses
            break #Breaking the loop
    elif choice == 's': #If the player chooses to stand
        while dealer_score < 17: #While the dealer's score is less than 17
            dealer_card.append(deck.pop()) #The dealer gets a new card
            dealer_score = sum(card_value(card) for card in dealer_card) #Calculating the dealer's score
        print(f"Your cards are {player_card} and your score is {player_score}") #Printing the player's cards and score
        print(f"The dealer's cards are {dealer_card} and their score is {dealer_score}") #Printing the dealer's cards and score
        if dealer_score > 21: #If the dealer's score is over 21
            print("You win!") #Printing that the player wins
            break #Breaking the loop
        elif dealer_score > player_score: #If the dealer's score is higher than the player's score
            print("You lose!") #Printing that the player loses
            break #Breaking the loop
        elif dealer_score < player_score: #If the dealer's score is lower than the player's score
            print("You win!") #Printing that the player wins
            break #Breaking the loop
        else: #If the dealer's score is equal to the player's score
            print("It's a tie!") #Printing that it's a tie
            break #Breaking the loop
    else: #If the player doesn't choose to hit or stand
        print("Please enter a valid input!") #Printing that the player should enter a valid input
        continue #Continuing the loop
    

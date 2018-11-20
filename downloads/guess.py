#!/usr/bin/env python
import sys
from random import randint
play=1
while (play):
	chances = 3
	computer=randint(1,10)
	print "++Guessing Game v0.1 by EmErgE++"
	print "[31mI've guessed a number between 1 to 10. You have 3 chances to guess.[0m"
	while (chances):
		myguess=int(raw_input("[32mEnter your guess:[0m "))
		if myguess < computer:
			print "[33mYour guess is less than mine.[0m"
		elif myguess > computer:
			print "[33mYour is greater than mine.[0m"
		else:
			print "[35mBravo! We both guessed",computer," XDD[0m"
			break
		chances = chances - 1
	else:
		print "Oops, your chances are over! I guessed ",computer
	cont=raw_input("[34mDo You want to play again? (y/n)[0m ")
	if cont=="n":
		play=0
else:
	print "Game Over."


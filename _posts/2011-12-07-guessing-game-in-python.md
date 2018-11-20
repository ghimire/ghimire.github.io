---
layout: post
comments: true
title: Guessing Game v1.0
description: Three chances to uess a computer generated random number between 1 to 10
category : Programming
tags : [python, random]
---

>This brings back memories. It's a python recreation of old guessing game in qbasic. Computer guesses random number from 1 to 10. You have 3 chaces to guess it right.  

    #!/usr/bin/env python
    import sys
    from random import randint
    play=1
    while (play):
        chances = 3
        computer=randint(1,10)
        print "++Guessing Game v0.1 by EmErgE++"
        print "I've guessed a number between 1 to 10. You have 3 chances to guess."
        while (chances):
            myguess=int(raw_input("Enter your guess:"))
            if myguess < computer:
                print "Your guess is less than mine."
            elif myguess > computer:
                print "Your is greater than mine."
            else:
                print "Bravo! We both guessed",computer," XDD"
                break
            chances = chances - 1
        else:
            print "Oops, your chances are over! I guessed ",computer
        cont=raw_input("Do You want to play again? (y/n)")
        if cont=="n":
            play=0
    else:
        print "Game Over."

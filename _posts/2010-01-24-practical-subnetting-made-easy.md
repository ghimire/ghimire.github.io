---
layout: post
comments: true
category : Networking
tags : [subnet, IP]
---
    First off, remember the series of numbers and their order:
    128, 192, 224, 240, 248, 252, 254, 255

    Also remember,
    /24 = Class C (255.255.255.0)
    /16 = Class B (255.255.0.0)
    /8  = Class A (255.0.0)

    class A is between 0.0.0.0  127.255.255.255
    class B is between 128.0.0.0  191.255.255.255
    class C is between 192.0.0.0  223.255.255.255

    Interestingly the starting numbers of each class is similar to above series of numbers.

    Another way to remember is:
        class A 0 to 127
        class B 128 to 191
        class C 192 to 223

    * The numbers 127 and 192 are easy to rememner since 127.0.0.1 is loopback address
      and 192.168.0.0/16 is one of the private IP range

    Now let's do an example:

    Example 1) (Type: Class C)  192.168.1.104 with prefix /27
    ==>
    We have /27 which falls under class C /24 (255.255.255.0)

    Calculating Number of Subnets:
    ------------------------------
        27 - 24 = 3	[Here we subtract the prefix from closest-match class prefix]
        2^3 = 8		[Here we calculate the result as power of 2]
    Therefore, Number of Subnets = 8

    Calculating Number of hosts:
    ----------------------------
        (8 - 3) = 5 [where 8 is the number of bits in each octet and is constant]
    Therefore, number of hosts = 2^5 - 2 = 32 -2 = 30 (We subtract 2 because each subnet has 1 network and 1 broadcast address)

    Calculating Subnet Mask
    -------------------------
    From above table, third number on the series ( 128, 192, 224) is 224. Since this is Class C prefix, (255.255.255.0)
    Subnet Mask for /27 subnet is 255.255.255.224

    Subnet mask can also be obtained from simple math. Take 3 (27 - 24). Since there are
    8 bits in each octet, the first three bits become 1 which gives us,
    2^7 + 2^6 + 2^5 + 0 + 0 + 0 + 0 + 0 = 128 + 64 + 32 = 224

    Calculating Each Subnets
    ------------------------
    We have already obtained Number of hosts = 30 
    Including Network and broadcast, we have 32

    We can now find out each subnet by adding 32 (which is the number of hosts including network and broadcast) starting from 0.

    So our networks are:
    192.168.1.0/27
    192.168.1.32/27
    192.168.1.64/27
    192.168.1.96/27       __Our IP Falls In This Subnet__
    192.168.1.128/27		
    192.168.1.160/27
    192.168.1.192/27
    192.168.1.224/27

    You don't have to compute each subnet. To quickly identify which subnet 
    IP belongs to, divide last octet (for class C) by subnet number 32

    104/32 = 3 (discard the value after decimal point)

    Network Address can be calculated as: 3 * 32 = 96
    That gives us 192.168.1.96/27

    Broadcast Address, Minimum and Maximum Hosts:
    ---------------------------------------------
    Broadcast address is always the last address in a subnet which is also the last number before next subnet starts.
    In this case broadcast address is 192.168.1.127

    The minimum available IP of host is the first IP after subnet's network address.
    In this case minimum host is 192.168.1.97

    The maximum available IP of host is the IP before broadcast address.
    In this case maximum host is 192.168.1.126

    Summary
    -------
    Network Address: 192.168.1.96/27
    Subnet Mask: 255.255.255.224
    Broadcast Address: 192.168.1.127
    Minimum Host IP: 192.168.1.97
    Maximum Host IP: 192.168.1.126
    Next Subnet: 192.168.1.128/27

    Let's do another example:

    Example 2) (Type: Class B)  151.33.63.124 with prefix /18
    ==>
    We have /18 which falls under class B /16 (255.255.0.0)

    Calculating Number of Subnets:
    ------------------------------
        18 - 16 = 2	[Here we subtract the prefix from closest-match class prefix]
        2^2 = 4		[Here we calculate the result as power of 2]
    Therefore, Number of Subnets = 4

    Calculating Number of hosts:
    ----------------------------
        (8 - 2) = 6 [where 8 is the number of bits in each octet and is constant]
    Therefore, number of hosts = 2^6 - 2 = 64 -2 = 62 (We subtract 2 because each subnet has 1 network and 1 broadcast address)

    Calculating Subnet Mask
    -------------------------
    From above table, second number on the series ( 128, 192) is 192. Since this is Class B prefix, (255.255.0.0)
    Subnet Mask for /18 subnet is 255.255.192.0

    Subnet mask can also be obtained from simple math. Take 2 (18 - 16). Since there are
    8 bits in each octet, the first three bits become 1 which gives us,
    2^7 + 2^6 + 0 + 0 + 0 + 0 + 0 + 0 = 128 + 64 = 192

    Calculating Each Subnets
    ------------------------
    We have already obtained Number of hosts = 62
    Including Network and broadcast, we have 64

    We can now find out each subnet by adding 64 (which is the number of hosts including network and broadcast) starting from 0.

    So our equal hosts networks are:
    151.33.0.0/18       __Our IP Falls In This Subnet__
    151.33.64.0/18
    151.33.128.0/18	
    151.33.192.0/18

    You don't have to compute each subnet. To quickly identify which subnet 
    IP belongs to, divide last octet (for class C) by subnet number 32

    124/64 = 0 (discard the value after decimal point)

    Network Address can be calculated as: 0 * 64 = I'll leave you to it.
    That gives us 151.33.0.0/18

    Broadcast Address, Minimum and Maximum Hosts:
    ---------------------------------------------
    Broadcast address is always the last address in a subnet which is also the last number before next subnet starts.
    In this case broadcast address is 151.33.63.255

    The minimum available IP of host is the first IP after subnet's network address.
    In this case minimum host is 151.33.0.1

    The maximum available IP of host is the IP before broadcast address.
    In this case maximum host is 151.33.63.254

    Summary
    -------
    Network Address: 151.33.0.0/18
    Subnet Mask: 255.255.192.0
    Broadcast Address: 151.33.63.255
    Minimum Host IP: 151.33.0.0
    Maximum Host IP: 151.33.63.254
    Next Subnet: 192.168.64.0/18

    [Reference]
    Subnet Cheat Sheet: http://support.tranzeo.com/guides/network/Subnet%20Cheat%20Sheet.pdf

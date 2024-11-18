https://yourdomain.com/?hash={tokenHash}&animate={bool}&bg={1-10}&speed={0.01-n}

example: 

https://projectonthemoon.com/squigparams?hash=0xa15e97b452cccad77d2da9c8977dc1ed43f0882b99fafff8df80a9dc1f020af3&animate=true&bg=10&speed=1

Instructions: 

Pull hash from etherscan: https://etherscan.io/token/0x059edd72cd353df5106d2b9cc5ab83a52287ac3a#readContract (function is showTokenHashes, input is squiggle ID).

animate is requesting a true/false if true the squiggle will start animated otherwise will start static
bg should be an integer betwee 1 and 10, 1 being white and 10 being black and in between being the steps of grey that are available by pressing space bar on the live view
speed is the animation speed this can be super slow (0.1 or even less, ideal for older televisions with browser support) with no max but change is imperceptible above a certain point. 

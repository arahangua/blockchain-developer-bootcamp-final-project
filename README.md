# Detecting participants' voting opinion correlations  
(very basic analysis method implemented in solidity) 

## Background
### Problem : 
When we vote, we reach consensus based on the 'majority rule'. If that voting was a one-time thing, it might not be worth to think about the majority-minority split. Nevertheless, if we have recurring votes with similar agenda, out of sustainability concern for the community, it would be worth to check if there is any significant organizational behavior. For example, we could check whether there is a cohesive group of participants almost always agree on their decisions or if the composition of the community is near perfectly varied.  

### Solution:
Simply put, given the covariance matrix from the past voting history (each vote decision is encoded in one of 3 integers [-1, 0, 1]), we check whether the community decision is correlated or not. The concept of "participatio ratio" is used. All participants would have option to see how their community is diverging/converging in their decision making and potentially use this information to organize necessary negotiations/measures. 

outputs : 
1) Is this community correlated in their decision making given the voting history? (yes, no)
2) How much? (float value)

### implemented features 
1) Voting
2) Voting history management
3) Computation of Participation ratio


  

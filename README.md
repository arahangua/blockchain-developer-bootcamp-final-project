# blockchain-developer-bootcamp-final-project
final project for Consensys blockchain developer bootcamp 2021

# Foundation for Real-time data analysis on Blockchain 

## Background
### Problem : 
Market adoption of Real-time data analysis is hindered by : 
1) Data size : storing multidimensional real-time data can easily get out of control even for enterprises (>Terabytes).
2) Privacy concern : subset of real-time data out there is privacy-sensitive. 
###Solution:
Implement a blockchain real-time data analysis pipeline to get summary statistics with time tags.

**Healthcare example** : Smart sensors recording cardiac signals of a patient (e.g. apple watch or similar device in near future) will be sending out personal information (privacy concern), this signal must be tracked for an indefinite amount of time to detect anomalies (e.g. arrhythmia) and must be processed real-time to act within effective time window (real-time processing).

## Project idea (WIP) : 
Implement Pubsub data acquisition flow on the blockchain.

### points to consider 
1. Assume continuous dataflow from users (e.g. smart watches) 
2. Assume credibility for 1) is already taken care of... (e.g. hardware oracle etc..) 
3. Using arbitrary discrete time window, chunk the dataflow
4. For each chunk, compute a simple summary stat (e.g. correlation coef...)
5. Concatenate meta data (e.g. timestamps) to 4)
6. Store computed result from 5) to storage (local, IPFS...)
7. Register hash of the computed result (5,6) to the blockchain

(if time allows) 8. Implement loading of previously computed results to generate time-series for downstream analysis. 

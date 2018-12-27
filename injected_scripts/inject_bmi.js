try {
    (function(pbjs) {
        console.log(pbjs)        
        var getBidResponses = pbjs.getBidResponses;    

        pbjs.getBidResponses = function() {
            var result = getBidResponses.apply(this, arguments);
            var event = new CustomEvent("bidResponses", {
                detail: {
                    bids: JSON.stringify(result)
                }
            })     
            document.dispatchEvent(event);   
            return result;
        }
        var getAllWinningBids = pbjs.getAllWinningBids;

        pbjs.getAllWinningBids = function() {
            var result = getAllWinningBids.apply(this, arguments);
            var event = new CustomEvent("winningBidResponses", {
                detail: {
                    bids: JSON.stringify(result)
                }
            })
            document.dispatchEvent(event)
            return result;
        }
        pbjs.getBidResponses()
        pbjs.getAllWinningBids()
        localStorage.setItem("lastCallFor", Date.now())
        
    })(pbjs)
} catch (err) {
    console.log("failed to inject pbjs script")
    console.log(err)
}
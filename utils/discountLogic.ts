const logic:{[key:string]:{
    newTotal:Function,
    description:string}} = {
    "D_TESTTESTTEST": {
        newTotal:function(total:number){
        return Number(total)*(1-0.25)
        },
        description:"25% off"
    },
    '': {
        newTotal:function(total:number){
        return total
    },
    
    description:"NILSCH"},

    "D_TEST": {
        newTotal:function(total:number){
        return Number(total)*(1-0.25)
        },
        description:"25% off your first order!"
    },

    "DC_TrustMega25": {
        newTotal:function(total:number){
        return Number(total)*(1-0.25)
        },
        description:"25% off your first order!"
    },
}
export default logic
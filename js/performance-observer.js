var r=new PerformanceObserver(o=>{for(let e of o.getEntries())e.entryType==="layout-shift"&&console.log("Reflow occurs:",e)});r.observe({entryTypes:["layout-shift"]});

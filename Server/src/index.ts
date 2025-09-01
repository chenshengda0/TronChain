const mongoose = require('mongoose');
const {TronWeb} = require( "tronweb" );
const BigNumber = require( "bignumber.js" )
const cluster = require('cluster');
const schedule = require( "node-schedule" )

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err:any) => {
    console.error('MongoDB connection error:', err);
});


let job:any = null;
const Common = Object.defineProperties( {
    tronWeb: new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers:{
            //"TRON-PRO-API-KEY": "87a64256-29a5-440a-8ae9-0beaac13165e",
            "TRON-PRO-API-KEY": "de138222-4e0d-4adf-9164-d6bfb8c8b58c",
            //"TRON-PRO-API-KEY": "174b9c16-7463-4f61-a58f-4e047b3313ce",
            //"TRON-PRO-API-KEY": "2080d2eb-ac7b-441f-b8f4-0e1614e03777",
        },
        privateKey: 'dd616f72eb2db8709f877708960b2c7543e888acc7af5fc72abb4befee17e2ab'
    }),
    USDTAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    USDTAbi: [
        {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"_value","type":"uint256"}],"name":"calcFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"oldBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        {"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
        {"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},
        {"anonymous":false,"inputs":[],"name":"Pause","type":"event"},
        {"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},
        {"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}
    ],
}, {
    showAccountBalanceOf: {
        value: async function( blockArr:number[], account:string = "TCNTdakbmgSZasagGy7iBtB3awRs9uJya6" ){
            console.log( "===================================================获取账户余额=====================================================" )
            const that = this;
            try{
                const hexAccount = that.tronWeb.address.toHex( account )
                const USDTContract = await that.tronWeb.contract( that.USDTAbi, that.tronWeb.address.toHex( that.USDTAddress ) )
                const usdtBalance = await USDTContract.balanceOf( account ).call()
                const decimals = await USDTContract.decimals().call()
                const USDTbalanceOf = new BigNumber( BigInt( usdtBalance ).toString() ).dividedBy( (BigInt(10)**BigInt(decimals)).toString() ).toFixed()
                const trxBalance = await that.tronWeb.trx.getBalance( account );
                const trxBalanceOf = new BigNumber( trxBalance ).dividedBy( 10**6 ).toFixed()
                console.log( "   Account: ", account )
                console.log( "AccountHex: ", hexAccount )
                console.log( "       TRX: ", trxBalanceOf )
                console.log( "      USDT: ", USDTbalanceOf )
                const latestBlock = await that.tronWeb.trx.getCurrentBlock();
                //七天之前的区块
                //const startBlock = latestBlock.block_header.raw_data.number - 3600*24*7/3;
                //最新区块
                const lastBlock = latestBlock.block_header.raw_data.number
                /*
                const blockArr = Array.from( (function*(){
                    for( let i = startBlock; i <=  toBlock; ++i){
                        yield i;
                    }
                })() )
                */
                //创建集合
                const cacheColl = mongoose.connection.collection("USDTTransferEvent");
                for  await( const block of  blockArr){
                    //记录交易日志
                    let allEvents = [];
                    //分页游标
                    let fingerprint = null;
                    while( true ){
                        const history: any = await that.tronWeb.getEventResult(
                            that.USDTAddress,
                            {
                                eventName: 'Transfer',
                                blockNumber: block,
                                limit: 200,
                                fingerprint: fingerprint
                            }
                        );
                        allEvents.push(...history.data);
                        const meta = history.meta || {};
                        fingerprint = meta.fingerprint; // 下一页要用这个
                        if (!meta.links || !meta.links.next) {
                            break; // 没有下一页就结束
                        }
                    }
                    //console.log( allEvents[0] );

                    //写入mongodb
                    const insertArr = Array.from(allEvents).map( (log) => ({
                        block_number: log.block_number,
                        block_timestamp: Date.now() - ( lastBlock - block ) * 3,

                        transaction_id: log.transaction_id,
                        contract_address: log.contract_address,

                        event: log.event,
                        from: that.tronWeb.address.fromHex(log.result.from),

                        fromHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.from) ),
                        to: that.tronWeb.address.fromHex(log.result.to),

                        toHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.to) ),
                        amount: new BigNumber( BigInt( log.result.value ).toString() ).dividedBy( (BigInt( 10 )**BigInt( decimals )).toString() ).toFixed()
                    }) );

                    // insertArr 是你准备要插入的数据
                    const txIds = insertArr.map(d => d.transaction_id);

                    // 1. 查出已存在的 transaction_id
                    const existDocs = await cacheColl.find(
                        { transaction_id: { $in: txIds } },
                        { projection: { transaction_id: 1 } }
                    ).toArray();

                    // 获取已经存在的
                    const existIds = new Set(existDocs.map( (d:any) => d.transaction_id));

                    // 2. 过滤掉已经存在的
                    const newInsertArr = insertArr.filter(d => !existIds.has(d.transaction_id));

                    // 3. 插入剩下的
                    if (newInsertArr.length > 0) {
                        await cacheColl.insertMany(newInsertArr);
                        console.log( `区块${block}写入成功!` )
                    }else{
                        console.log( `区块${block}数据重复，写入失败!` )
                    }
                }
            }catch(err:any){
                console.log( err.message )
            }finally{
                console.log( "===================================================获取账户余额=====================================================" )
            }
        }
    },
    current: {
        value: async function(){
            if (job) {
                console.log("定时任务已存在，不要重复创建");
                return job;
            }
            const that = this;
            let RunningState = false;
            job = schedule.scheduleJob( "*/2 * * * * *", async function(){
                console.log( "===================================================获取当前区块数据=====================================================" )
                try{
                    const USDTContract = await that.tronWeb.contract( that.USDTAbi, that.tronWeb.address.toHex( that.USDTAddress ) )
                    const decimals = await USDTContract.decimals().call()
                    const latestBlock = await that.tronWeb.trx.getCurrentBlock();
                    //七天之前的区块
                    //const startBlock = latestBlock.block_header.raw_data.number - 3600*24*7/3;
                    //最新区块
                    const lastBlock = latestBlock.block_header.raw_data.number
                    const cacheColl = mongoose.connection.collection("USDTTransferEvent");
                    //记录交易日志
                    let allEvents = [];
                    //分页游标
                    let fingerprint = null;
                    while( true ){
                        const history: any = await that.tronWeb.getEventResult(
                            that.USDTAddress,
                            {
                                eventName: 'Transfer',
                                blockNumber: lastBlock,
                                limit: 200,
                                fingerprint: fingerprint
                            }
                        );
                        allEvents.push(...history.data);
                        const meta = history.meta || {};
                        fingerprint = meta.fingerprint; // 下一页要用这个
                        if (!meta.links || !meta.links.next) {
                            break; // 没有下一页就结束
                        }
                    }
                    //写入mongodb
                    const insertArr = Array.from(allEvents).map( (log) => ({
                        block_number: log.block_number,
                        block_timestamp: Date.now(),

                        transaction_id: log.transaction_id,
                        contract_address: log.contract_address,

                        event: log.event,
                        from: that.tronWeb.address.fromHex(log.result.from),

                        fromHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.from) ),
                        to: that.tronWeb.address.fromHex(log.result.to),

                        toHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.to) ),
                        amount: new BigNumber( BigInt( log.result.value ).toString() ).dividedBy( (BigInt( 10 )**BigInt( decimals )).toString() ).toFixed()
                    }) );

                    // insertArr 是你准备要插入的数据
                    const txIds = insertArr.map(d => d.transaction_id);

                    // 1. 查出已存在的 transaction_id
                    const existDocs = await cacheColl.find(
                        { transaction_id: { $in: txIds } },
                        { projection: { transaction_id: 1 } }
                    ).toArray();

                    // 获取已经存在的
                    const existIds = new Set(existDocs.map( (d:any) => d.transaction_id));

                    // 2. 过滤掉已经存在的
                    const newInsertArr = insertArr.filter(d => !existIds.has(d.transaction_id));

                    // 3. 插入剩下的
                    if (newInsertArr.length > 0) {
                        await cacheColl.insertMany(newInsertArr);
                        console.log( `区块${lastBlock}写入成功!` )
                    }else{
                        console.log( `区块${lastBlock}数据重复，写入失败!` )
                    }
                }catch(err:any){
                    console.log( err.message )
                }finally{
                    RunningState = false;
                    console.log( "===================================================获取当前区块数据=====================================================" )
                }
            })
            return job;
        }
    },
    //校验上一个区块是否更新完
    prev: {
        value: async function(){
            if (job) {
                console.log("定时任务已存在，不要重复创建");
                return job;
            }
            const that = this;
            let RunningState = false;
            job = schedule.scheduleJob( "*/2 * * * * *", async function(){
                console.log( "===================================================获取当前区块数据=====================================================" )
                try{
                    const USDTContract = await that.tronWeb.contract( that.USDTAbi, that.tronWeb.address.toHex( that.USDTAddress ) )
                    const decimals = await USDTContract.decimals().call()
                    const latestBlock = await that.tronWeb.trx.getCurrentBlock();
                    //七天之前的区块
                    //const startBlock = latestBlock.block_header.raw_data.number - 3600*24*7/3;
                    //最新区块
                    const lastBlock = latestBlock.block_header.raw_data.number - 1
                    const cacheColl = mongoose.connection.collection("USDTTransferEvent");
                    //记录交易日志
                    let allEvents = [];
                    //分页游标
                    let fingerprint = null;
                    while( true ){
                        const history: any = await that.tronWeb.getEventResult(
                            that.USDTAddress,
                            {
                                eventName: 'Transfer',
                                blockNumber: lastBlock,
                                limit: 200,
                                fingerprint: fingerprint
                            }
                        );
                        allEvents.push(...history.data);
                        const meta = history.meta || {};
                        fingerprint = meta.fingerprint; // 下一页要用这个
                        if (!meta.links || !meta.links.next) {
                            break; // 没有下一页就结束
                        }
                    }
                    //写入mongodb
                    const insertArr = Array.from(allEvents).map( (log) => ({
                        block_number: log.block_number,
                        block_timestamp: Date.now(),

                        transaction_id: log.transaction_id,
                        contract_address: log.contract_address,

                        event: log.event,
                        from: that.tronWeb.address.fromHex(log.result.from),

                        fromHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.from) ),
                        to: that.tronWeb.address.fromHex(log.result.to),

                        toHex: that.tronWeb.address.toHex( that.tronWeb.address.fromHex(log.result.to) ),
                        amount: new BigNumber( BigInt( log.result.value ).toString() ).dividedBy( (BigInt( 10 )**BigInt( decimals )).toString() ).toFixed()
                    }) );

                    // insertArr 是你准备要插入的数据
                    const txIds = insertArr.map(d => d.transaction_id);

                    // 1. 查出已存在的 transaction_id
                    const existDocs = await cacheColl.find(
                        { transaction_id: { $in: txIds } },
                        { projection: { transaction_id: 1 } }
                    ).toArray();

                    // 获取已经存在的
                    const existIds = new Set(existDocs.map( (d:any) => d.transaction_id));

                    // 2. 过滤掉已经存在的
                    const newInsertArr = insertArr.filter(d => !existIds.has(d.transaction_id));

                    // 3. 插入剩下的
                    if (newInsertArr.length > 0) {
                        await cacheColl.insertMany(newInsertArr);
                        console.log( `区块${lastBlock}写入成功!` )
                    }else{
                        console.log( `区块${lastBlock}数据重复，写入失败!` )
                    }
                }catch(err:any){
                    console.log( err.message )
                }finally{
                    RunningState = false;
                    console.log( "===================================================获取当前区块数据=====================================================" )
                }
            })
            return job;
        }
    },
    checkData: {
        value: async function(){
            console.log( "===================================================查询缺失区块=====================================================" )
            const that = this;
            try{
                const cacheColl = mongoose.connection.collection("USDTTransferEvent");
                const res = await cacheColl.aggregate([
                    {
                        $group: {
                            _id: null,
                            minBlock: { $min: "$block_number" },
                            maxBlock: { $max: "$block_number" }
                        }
                    }
                ]);
                const ans = await res.next();
                console.log( ans )
                const lists =  await cacheColl.aggregate([
                    { $group: { _id: "$block_number" } },
                    { $sort: { _id: 1 } }
                ])
                const exists:number[] = [];
                for await( const row of lists ){
                    exists.push( row._id )
                }
                const misss:number[] = [];
                for( let i = ans.minBlock; i <= ans.maxBlock; ++i ){
                    if( !exists.includes( i ) ){
                        misss.push( i )
                    }
                }
                return misss;
            }catch(err:any){
                console.log( err.message )
            }finally{
                console.log( "===================================================查询缺失区块=====================================================" )
            }
        }
    },
    show:{
        value: async function(account:string="TCNTdakbmgSZasagGy7iBtB3awRs9uJya6"){
            console.log( "===================================================查询资账户交易=====================================================" )
            const that = this;
            try{
                const cacheColl = mongoose.connection.collection("USDTTransferEvent");
                const oneDoc = await cacheColl.aggregate( [
                    { $match: { 
                        from: account,
                        $expr: { $lt: [ { $toDouble: "$amount" }, 10 ] }
                    } },
                    
                    { $group: { _id: null, tos: { $addToSet: "$to" } } },
                    { $project: { _id: 0, tos: 1 } }
                ] );
                const oneDocs = await oneDoc.next();
                //console.log( oneDocs )
                //去除合约账户
                
                const oneDocss = oneDocs.tos.map( (row:any) => row !== "TWzvWGHxDUXRtR7ACFaKUZbgbJDiM8Lvcd" )
                console.log( JSON.stringify( oneDocs.tos ) )


                console.log( oneDocs.tos.length, oneDocss.length )
                
                const ans = await cacheColl.aggregate( [
                    {         
                        $match: { 
                            to: { $in: oneDocs.tos },
                            $expr: { $gt: [ { $toDouble: "$amount" }, 10 ] }
                        }  
                    },
                ] );
                for await ( const res of ans ){
                    if (res.from !== "TWzvWGHxDUXRtR7ACFaKUZbgbJDiM8Lvcd"){
                        console.log( res )
                    }
                }
            }catch(err:any){
                console.log( err.message )
            }finally{
                console.log( "===================================================查询资账户交易=====================================================" )
            }
        }
    }
} ) as any;

;(async function(){
    //获取账户信息
    /*
    const initBlock = 75246304;
    const totalTasks = 60000;
    const tasksPerWorker = 30000;
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        // 计算需要启动多少个 worker
        const numWorkers = Math.ceil(totalTasks / tasksPerWorker);

        for (let i = 0; i < numWorkers; i++) {
            const worker = cluster.fork({ WORKER_INDEX: i });
            worker.send({ start: initBlock + i * tasksPerWorker, end: Math.min(initBlock + (i + 1) * tasksPerWorker, initBlock + totalTasks) });
        }

        cluster.on('exit', (worker:any, code:any, signal:any) => {
            console.log(`Worker ${worker.process.pid} exited`);
        });
    } else {
        process.on('message', async (msg:any) => {
            const { start, end } = msg;
            console.log(`Worker ${process.pid} processing tasks ${start} to ${end - 1}`);
            await Common.showAccountBalanceOf(start, end)
            //process.exit(0); // 处理完退出
        });
    }
    */
    //await Common.showAccountBalanceOf(75331238, 75336117)

    
    const lists = await Common.checkData();
    await Common.showAccountBalanceOf(lists)
    //await Common.showAccountBalanceOf(75298062, 75306304)

    //补几个区块
    //await Common.showAccountBalanceOf(75320190, 75320933)
    
    //await Common.current()

    //await Common.show();

    //process.exit( 0 )
})();

/*
db.USDTTransferEvent.aggregate([ { $match: { block_number: { $lt: 75336116 } } }, { $sort: { block_number: -1 } } ]);
*/
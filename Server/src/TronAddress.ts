const mongoose = require('mongoose');
const {TronWeb} = require( "tronweb" );
const bs58 = require('bs58');
const schedule = require( "node-schedule" )

mongoose.connect("mongodb://root:a123456.@127.0.0.1:27017/Quantation?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err:any) => {
    console.error('MongoDB connection error:', err);
});

const tronAddressSchema = new mongoose.Schema({
    prefix: { type: String },        // 前缀或其他索引字段
    suffix: { type: Buffer }        // Buffer 类型字段
});
tronAddressSchema.index({ prefix: 1 }, { unique: true });
tronAddressSchema.index({ __v: 1 });


const TronAddress = mongoose.model("TronAddress", tronAddressSchema, "TronAddress");
/*hijkmnopqrstuvwxyz*/
/*
const modules = [
    mongoose.model("TronAddress", tronAddressSchema, "T1"),
    mongoose.model("TronAddress", tronAddressSchema, "T2"),
    mongoose.model("TronAddress", tronAddressSchema, "T3"),
    mongoose.model("TronAddress", tronAddressSchema, "T4"),
    mongoose.model("TronAddress", tronAddressSchema, "T5"),
    mongoose.model("TronAddress", tronAddressSchema, "T6"),
    mongoose.model("TronAddress", tronAddressSchema, "T7"),
    mongoose.model("TronAddress", tronAddressSchema, "T8"),
    mongoose.model("TronAddress", tronAddressSchema, "T9"),
    mongoose.model("TronAddress", tronAddressSchema, "TA"),

    mongoose.model("TronAddress", tronAddressSchema, "TB"),
    mongoose.model("TronAddress", tronAddressSchema, "TC"),
    mongoose.model("TronAddress", tronAddressSchema, "TD"),
    mongoose.model("TronAddress", tronAddressSchema, "TE"),
    mongoose.model("TronAddress", tronAddressSchema, "TF"),
    mongoose.model("TronAddress", tronAddressSchema, "TG"),
    mongoose.model("TronAddress", tronAddressSchema, "TH"),
    mongoose.model("TronAddress", tronAddressSchema, "TJ"),
    mongoose.model("TronAddress", tronAddressSchema, "TK"),
    mongoose.model("TronAddress", tronAddressSchema, "TL"),

    mongoose.model("TronAddress", tronAddressSchema, "TM"),
    mongoose.model("TronAddress", tronAddressSchema, "TN"),
    mongoose.model("TronAddress", tronAddressSchema, "TP"),
    mongoose.model("TronAddress", tronAddressSchema, "TQ"),
    mongoose.model("TronAddress", tronAddressSchema, "TR"),
    mongoose.model("TronAddress", tronAddressSchema, "TS"),
    mongoose.model("TronAddress", tronAddressSchema, "TT"),
    mongoose.model("TronAddress", tronAddressSchema, "TU"),
    mongoose.model("TronAddress", tronAddressSchema, "TV"),
    mongoose.model("TronAddress", tronAddressSchema, "TW"),

    mongoose.model("TronAddress", tronAddressSchema, "TX"),
    mongoose.model("TronAddress", tronAddressSchema, "TY"),
    mongoose.model("TronAddress", tronAddressSchema, "TZ"),
    mongoose.model("TronAddress", tronAddressSchema, "Ta"),
    mongoose.model("TronAddress", tronAddressSchema, "Tb"),
    mongoose.model("TronAddress", tronAddressSchema, "Tc"),
    mongoose.model("TronAddress", tronAddressSchema, "Td"),
    mongoose.model("TronAddress", tronAddressSchema, "Te"),
    mongoose.model("TronAddress", tronAddressSchema, "Tf"),
    mongoose.model("TronAddress", tronAddressSchema, "Tg"),

    mongoose.model("TronAddress", tronAddressSchema, "Th"),
    mongoose.model("TronAddress", tronAddressSchema, "Ti"),
    mongoose.model("TronAddress", tronAddressSchema, "Tj"),
    mongoose.model("TronAddress", tronAddressSchema, "Tk"),
    mongoose.model("TronAddress", tronAddressSchema, "Tm"),
    mongoose.model("TronAddress", tronAddressSchema, "Tn"),
    mongoose.model("TronAddress", tronAddressSchema, "To"),
    mongoose.model("TronAddress", tronAddressSchema, "Tp"),
    mongoose.model("TronAddress", tronAddressSchema, "Tq"),
    mongoose.model("TronAddress", tronAddressSchema, "Tr"),


    mongoose.model("TronAddress", tronAddressSchema, "Ts"),
    mongoose.model("TronAddress", tronAddressSchema, "Tt"),
    mongoose.model("TronAddress", tronAddressSchema, "Tu"),
    mongoose.model("TronAddress", tronAddressSchema, "Tv"),
    mongoose.model("TronAddress", tronAddressSchema, "Tw"),
    mongoose.model("TronAddress", tronAddressSchema, "Tx"),
    mongoose.model("TronAddress", tronAddressSchema, "Ty"),
    mongoose.model("TronAddress", tronAddressSchema, "Tz")
];
*/













let job:any = null;

const Common = Object.defineProperties( {

}, {
    init: {
        value: async function(){
            console.log( "============================初始化数据库=========================" )
            const that = this;
            console.time( "init" )
            try{
                const batchSize = 60000; // 每次批量写入 1000 条
                const docs = [];
                const suffix = Buffer.alloc(58*32, 0);

                for (let i = 0x13095a20; i < 58**5; i++) {
                    docs.push({
                        prefix: bs58.encode(Buffer.from(i.toString(16).padStart(8, "0"), "hex")).padStart(6, "1"),
                        suffix: suffix
                    });

                    if (docs.length === batchSize) {
                        await TronAddress.insertMany(docs, { ordered: false });
                        docs.length = 0;
                    }
                }

                if (docs.length > 0) {
                    await TronAddress.insertMany(docs, { ordered: false });
                }
            }catch(err:any){
                console.log( err.message )
            }finally{
                console.timeEnd( "init" )
                console.log( "============================初始化数据库=========================" )
            }
        }
    },
    create: {
        value: async function( times: number = 5 ){
            if (job) {
                console.log("定时任务已存在，不要重复创建");
                return job;
            }
            let RunningState = false;
            job = schedule.scheduleJob( "* * * * * *", async function(){
                console.log( "============================初始化数据库=========================" )
                //console.time( "create" )
                try{
                    const base58Code = new Map( (function*(){
                        const arr = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".split( "" )
                        for( let i = 0; i < arr.length; ++i  ){
                            yield [arr[i], i]
                        }
                    })() )
                    const timesArr = Array.from( (function*(){
                        for( let i = 0; i < times; ++i ) yield i;
                    })() )
                    const updates = [];
                    for await ( const i of timesArr ){
                        const current = await TronWeb.createAccount();
                        const base58Address = current.address.base58;
                        const privateKey = BigInt( `0x${ current.privateKey }` );
                        const subString = `${base58Address.slice(-6)}`;
                        const prefix = `1${ base58Address.slice(-5) }`
                        const data = await TronAddress.aggregate( [ { $match: { prefix: prefix } } ] )
                        const currentVal = BigInt( `0x${data[0].suffix.buffer.toString( "hex" )}` );
                        //检查当前位置是否已经存在值
                        if( ((currentVal >> ( BigInt( 32 ) * BigInt( base58Code.get( subString[0] ) as unknown as any ) ) ) & BigInt( "0x0000000000000000000000000000000000000000000000000000000000000000" )) === BigInt( 0 ) ){
                            const updateVal = currentVal ^ (privateKey << ( BigInt( 32 ) * BigInt( base58Code.get( subString[0] ) as unknown as any ) ));
                            //BigInt 转 buffer
                            const updateMiddleHex = updateVal.toString( 16 ).padStart( 58*32, "0" )
                            updates.push( {
                                updateOne: {
                                    filter: { prefix: prefix },
                                    update: {
                                        $set: { suffix: updateMiddleHex },
                                        $inc: { __v: 1 }
                                    }
                                }
                            } )
                        }
                        //console.log( `updateIndex: ${i}, uniqueIndex: ${ prefix }` )
                    }
                    const res = await TronAddress.bulkWrite(updates);
                    console.log( res )
                }catch(err:any){
                    console.log( err.message )
                }finally{
                    RunningState = false;
                    //console.timeEnd( "create" )
                    console.log( "============================初始化数据库=========================" )
                }
            });
            return job;
        }
    }
} ) as any;

;(async function(){
    await Common.create(180);
    //await Common.create();
    //process.exit( 0 )
})();

export {}
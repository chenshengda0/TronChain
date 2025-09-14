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
    _id: { type: String, required: true },        // 前缀或其他索引字段
    suffix: { type: Buffer, required: true }        // Buffer 类型字段
}, { versionKey: false } );


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

const Common = Object.defineProperties( {

}, {
    init: {
        value: async function(){
            console.log( "============================初始化数据库=========================" )
            const that = this;
            console.time( "init" )
            try{
                const res = await TronAddress.aggregate( [{
                    $sort: {
                        _id: -1
                    }
                }, {
                    $limit: 20
                }] );
                const ans = Array.from( (function*(){
                    for( const row of res ){
                        yield {
                            _id: row._id,
                            suffix: `0x${Buffer.from( row.suffix.buffer ).toString( "hex" )}`,
                            address: TronWeb.address.fromPrivateKey( `${Buffer.from( row.suffix.buffer ).toString( "hex" )}` )
                        }
                    }
                })() )
                console.log( ans )
            }catch(err:any){
                console.log( err.message )
            }finally{
                console.timeEnd( "init" )
                console.log( "============================初始化数据库=========================" )
            }
        }
    },
    create: {
        value: async function( times: number = 5000 ){
            let RunningState = false;
            return schedule.scheduleJob( "* * * * * *", async function(){
                if(RunningState) return;
                console.log( "============================初始化数据库=========================" )
                //console.time( "create" )
                RunningState = true;
                console.time( "create" )
                try{
                    const updates = [];
                    for( let i = 0; i < times; ++i ){
                        const current = TronWeb.createRandom();
                        const base58Address = current.address;
                        const privateKey = BigInt( current.privateKey ).toString( 16 ).padStart( 64, '0' );
                        const subString = base58Address.slice(-6).split("").reverse().join("");
                        updates.push( {
                            updateOne: {
                                filter: { _id: subString },
                                update: { $setOnInsert: { suffix: Buffer.from( privateKey, "hex" ) } },
                                upsert: true
                            }
                        } )
                    }
                    await TronAddress.bulkWrite(updates);
                    //console.log( res )
                }catch(err:any){
                    console.log( err.message )
                }finally{
                    RunningState = false;
                    console.timeEnd( "create" )
                    console.log( "============================初始化数据库=========================" )
                }
            });
        }
    }
} ) as any;

;(async function(){
    await Common.create(10000);
    //await Common.init();
    //process.exit( 0 )
})();

export {}

/*
const BATCH_SIZE = 1000;
let lastId = null;

while (true) {
    // 按 _id 排序分页读取
    const query = lastId ? {_id: {$gt: lastId}} : {};
    const docs = db.TronAddress_copy.find(query).sort({_id: 1}).limit(BATCH_SIZE).toArray();
    if (docs.length === 0) break;

    const newDocs = docs.map(doc => {
        const oldId = doc._id;
        const newId = oldId.split('').reverse().join(''); // 倒序
        return {...doc, _id: newId}; // 新集合的 _id
    });

    // 插入到新集合
    db.TronAddress.insertMany(newDocs);

    // 更新 lastId
    lastId = docs[docs.length - 1]._id;
}

db.TronAddress_copy.aggregate([
  {
    $addFields: {
      newId: {
        $reduce: {
          input: { $reverseArray: { $split: ["$_id", ""] } },
          initialValue: "",
          in: { $concat: ["$$value", "$$this"] }
        }
      }
    }
  },
  {
    $project: {
      _id: "$newId",
      suffix: 1
    }
  },
  {
    $out: "TronAddress"  // 或者用 $merge
  }
])

*/
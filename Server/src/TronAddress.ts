const mongoose = require('mongoose');
const {TronWeb} = require( "tronweb" );
const bs58 = require('bs58');

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
tronAddressSchema.index({ prefix: 1 });

/*hijkmnopqrstuvwxyz*/
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















const Common = Object.defineProperties( {

}, {
    init: {
        value: async function(){
            console.log( "============================初始化数据库=========================" )
            const that = this;
            console.time( "init" )
            try{
                const suffix = Buffer.from( "00".padStart( 3712, "0" ) );
                for( let i = 0; i < 58**3; ++i ){
                    for await ( const mod of modules ){
                        await mod.create( {
                            prefix: bs58.encode( Buffer.from( i.toString( 16 ).padStart( 8, "0" ), "hex" ) ),
                            suffix: suffix
                        } )
                    }
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

    }
} ) as any;

;(async function(){
    await Common.init();
    process.exit( 0 )
})();

export {}
// Kaerus - Anders Elo 2013


/*
http://www.w3.org/TR/html4/types.html#type-name
ID and NAME tokens must begin with a letter ([A-Za-z]) 
and may be followed by any number of letters, digits ([0-9]), 
hyphens ("-"), underscores ("_"), colons (":"), and periods (".").

ABNF notation
fragment      = *( pchar / "/" / "?" )
pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
pct-encoded   = "%" HEXDIG HEXDIG
sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
                 / "*" / "+" / "," / ";" / "="
*/

var URL = /^(?:([A-Za-z]+):)?(\/{0,3})(?:([^\x00-\x1F\x7F:]+)?:?([^\x00-\x1F\x7F:]*)@)?([\w\.\-]+)?(?::(\d+))?(?:\/([^\x00-\x1F\x7F]+))?$/;

var PATH = /^([^\x00-\x1F^\#^\?]+)?(?:#([^\x00-\x1F^\?]+))?(?:\?(.*))?$/;

function urlString(){
    var str = "";

    if(this.conn)
        str+= this.conn.toString();
    if(this.path)
        str+= '/' + this.path.toString();
    if(this.query)
        str+= '?' + this.query.toString();

    return str;
}

function connString(){
    var str = "";
  
    if(this.protocol) str+= this.protocol + '://';
    if(this.username) { 
        str+= this.username + (this.password ? ':' + this.password : '') + '@';
    }
    if(this.host) str+= this.host; 
    if(this.port) str+= ':' + this.port;
  
    return str;    
}

function pathString(){
    var str = "";
  
    if(this.base) str+= this.base;
    if(this.hash) str+= '#' + this.hash;
  
    return str;     
}

function queryString(){
    var str = "";
    
    if(this.parts)
        str+= this.parts.join('&');

    return str;    
}

function Url(parse) {

    var param, 
        ret = {};

    Object.defineProperty(ret,'toString',{
        enumerable: false,
        value: urlString
    });    
    
    if(typeof parse === 'string') {
        var q, p, u; 

        u = URL.exec(parse);

        if(u) {
            ret.conn = {};

            Object.defineProperty(ret.conn,'toString',{
                enumerable: false,
                value: connString
            });

            ret.conn.protocol = u[1];
            ret.conn.username = u[3];
            ret.conn.password = u[4];
            ret.conn.host = u[5];
            ret.conn.port = u[6];

            p = PATH.exec(u[7]);
        } else {
            p = PATH.exec(parse);
        }
        
        if(p) {
            ret.path = {};

            Object.defineProperty(ret.path,'toString',{
                enumerable: false,
                value: pathString
            });

            ret.path.base = p[1];
            ret.path.hash = p[2];
            
            q = p[3];

            if(q) {
                ret.query = {};
                ret.query.parts = q.split('&');
                if(ret.query.parts.length) {
                    
                    Object.defineProperty(ret.query,'toString',{
                        enumerable: false,
                        value: queryString
                    });

                    ret.query.toString = queryString;
                    ret.query.params = {};
                    ret.query.parts.forEach(function(part){
                        param = part.split('='); 
                        ret.query.params[param[0]] = param[1];   
                    });
                    
                }    
            }
        }
    }

    return ret; 
}

module.exports = Url;


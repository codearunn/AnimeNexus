class Cache{
  constructor(maxSize=500){
    this.store= new Map();
    this.maxSize= maxSize;

    // stats Tracking
    this.hits=0;
    this.misses=0;
  }

  set(key, value, ttlseconds=3600){ //1 hour default.
    const expiresAt= Date.now() + ttlseconds*1000;
    // why? =>
      // 1. Date.now() => returns time in milliseconds
      // 2. ttlseconds is in sec
      // 3. *1000 => ttlseconds in sec to milliseconds

    // If key exists → delete first to refresh insertion order
    if(this.store.has(key)){
      this.store.delete(key);
    }

    this.store.set(key, {
      value, expiresAt
    });
    // store = {
    //   "summary:naruto": {
    //       value: "...",
    //       expiresAt: 171234567
    //   }
    // }
    // Why store object not just value?
    // Because we need expiration tracking.
    // If we stored only: store.set(key, value) => We wouldn’t know when to delete

    // LRU Limit Protection
    if(this.store.size > this.maxSize){
      const oldestKey= this.store.keys().next().value;
      this.store.delete(oldestKey);
      console.log("⚠️ Cache limit reached → Oldest item removed:", oldestKey);
      // this.store.keys():
      // Returns an iterator of keys.
      // Map = {
      //   A → data
      //   B → data
      //   C → data
      // }
      // Keys iterator behaves like: ["A","B","C"]
      // .next()
      // Iterators don’t return values directly.
      // You must call .next().
      // It returns an object: { value: "A", done: false }
      // So:.next().value → "A"
    }
  }

  get(key){
    const data = this.store.get(key);

    // "Cache miss"
    if(!data) {
      this.misses++;
      if(process.env.NODE_ENV !== 'production') console.log("Cache miss:", key);
      return null;
    }

    // EXPIRED
    if(Date.now() > data.expiresAt){
      this.store.delete(key);
      this.misses++;
      if(process.env.NODE_ENV !== 'production') console.log("Cache expired:", key);
      return null;
    }
    // Why delete immediately?
    // So expired data doesn’t stay in memory.
    // Otherwise memory leak risk.

    //hit
    this.hits++;
    if(process.env.NODE_ENV !== 'production') console.log("Cache hit:", key);
    return data.value;
  }

  // Useful for checking existence without fetching value.
  has(key){
    return this.get(key)!==null; // value!==null =>true & null!==null => false
  }
  // I reused the existing get() method so expiration logic stays centralized.
  // That avoids duplicated code and guarantees consistent cache validation behavior.

  delete(key){ // Method to manually remove a key.
    this.store.delete(key); // O(1) => very fast
  }

  clear(){
    this.store.clear();
    console.log("Cache cleared");
  }
  // Clears entire Map.
  //   Used when:
  //     •	server restart
  //     •	memory issue
  //     •	admin reset cache



  cleanup(){ // Automatic garbage collector for expired items.
    const now = Date.now();
    for(const [key, data] of this.store.entries()){ // [ key , valueObject => data ]
      if(now> data.expiresAt){
        this.store.delete(key);
      }
    }
  }
  // Why needed?
  // Because expired items might never be accessed again.
  // If user never requests them again:
  // → get() won’t run
  // → they stay forever
  // Memory leak.
  // So cleanup ensures old data removed automatically.


  stats(){
    return {
      hits:this.hits,
      misses:this.misses,
      size:this.store.size,
      hitRate:this.hits+this.misses===0
              ? 0
              : ((this.hits/ (this.hits+this.misses))*100).toFixed(2)+"%",

    };
  }
}

// Creates single cache instance.
const cache = new Cache(); // You export the INSTANCE, not the class.

// #6 Store the interval handle so it can be cleared during graceful shutdown / test teardown
cache.cleanupInterval = setInterval(() => cache.cleanup(), 300000);
// 300000 / 1000 = 300 seconds
// 300 / 60 = 5 minutes
// Why 5 minutes?

// Balance between:
// 	•	memory cleaning
// 	•	CPU usage

// Too frequent → CPU waste
// Too rare → memory growth

module.exports= cache;

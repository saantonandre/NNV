/**
 * Creates a dataset from an Idx file.
 * 
 * Handles the data according to the buffer's header specifications.
 * It will store the parsed data both as an array of the specified dimensions (this.data)
 * and as a monodimensional array (this.rawData)
 */
class IdxDataSet {
    /**
     * Creates a new dataset from the Idx format
     * 
     * @param {ArrayBuffer} buffer A stream of bytes data
     */
    constructor(buffer) {
        /**
         * Each entry represents the size of each dimension
         * @type {Array}
         */
        this.dimensions = [];

        /**
         * A monodimensional array of the parsed data, in disregard of the dimensions.
         * The type of this array will vary depending on the instructions
         * @type {Uint8Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array}
         */
        this.rawData;
        /**
         * An array of data organized according to the header instructions about the array sizes/dimensions
         */
        this.data;
        this.initialize(buffer);
    }
    /** 
     * Reads the header of the array and parses the data accordingly 
     * 
     * @param {ArrayBuffer} buffer A stream of bytes data
     */
    initialize(buffer) {
        /** Size of a 32-bit integer expressed in bytes */
        const INT32_SIZE = 4;

        /** An array composed of the first four bytes as unsigned integers, which represents the "Magic Number" */
        let magicNumber = new Uint8Array(buffer.slice(0, INT32_SIZE));

        // The first 2 bytes of the Magic Number are always 0
        if (magicNumber[0] !== 0 || magicNumber[1] !== 0) {
            // Otherwise it means the passed data is not formatted as an idx file type
            throw new TypeError("The data passed is not of type Uint8Array or the file you are trying to parse is not of type idx.");
        }

        /** Constructor for the type of data */
        let DataType;

        // The third byte codes the type of the data
        switch (magicNumber[2]) {
            case 0x08: // = 8
                DataType = Uint8Array; // Unsigned Byte
                break;
            case 0x09: // = 9
                DataType = Int8Array; // Signed Byte
                break;
            case 0x0B: // = 11
                DataType = Int16Array; // Short (2 Bytes)
                break;
            case 0x0C: // = 12
                DataType = Int32Array; // Int (4 Bytes)
                break;
            case 0x0D: // = 13
                DataType = Float32Array; // float (4 Bytes)
                break;
            case 0x0E: // = 14
                DataType = Float64Array; // double (8 Bytes)
                break;
        }

        // The 4-th byte(magicNumber[3]) codes the number of dimensions of the vector/matrix: 1 for vectors, 2 for matrices...

        // The header ends after the dimensions sizes (expressed as 32 bits integers)
        const header_end = INT32_SIZE + magicNumber[3] * INT32_SIZE;

        for (let i = INT32_SIZE; i < header_end; i += INT32_SIZE) {
            /*
            The line of code below is a workaround:

            Sizes in each dimension are 4-byte integers MSB first, high endian.

            Because of this, and since the Int32Array array reads by default in a little endian-fashion,
            the program needs to separate the data in 8-byte integers arrays and get a 32-byte integer
            from each of the array, in the correct endianess with the aid of DataView.getInt32,
            which reads by default as big-endian.
            
            */
            this.dimensions.push(new DataView(new Int8Array(buffer.slice(i, i + INT32_SIZE)).buffer).getInt32())
        }
        this.rawData = new DataType(buffer.slice(header_end));
        this.data = this.createArray(this.dimensions, this.rawData.slice(0));
    }
    /**
     * Creates an array of the specified depth and size, populating it with the passed data 
     * 
     * @param {Number[]} dims Array containing the size of each dimensions, the length of the array represents the depth
     * @param {Array} data Array containing the data which will populate the lowest dimensions
     */
    createArray(dims, data) {
        for (let i = dims.length - 1; i >= 1; i--) {
            data = this.partitionArray(data, dims[i]);
        }
        return data;
    }
    /**
     * Partitions an array into sub arrays of a specified length
     * 
     * @param {*} array The array that will be partitioned
     * @param {Number} amount The length of each sub arrays
     * @returns 
     */
    partitionArray(array, amount) {
        let newArray = [];
        for (let i = 0; i < array.length; i += amount) {
            newArray.push(array.slice(i, i + amount));
        }
        return newArray;
    }
    /**
     * Downloads the processed data JSON
     * 
     * @returns 
     */
    download(){
        console.log("Downloading the processed data as JSON...")
        const dataString = JSON.stringify(this.data);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataString);
        let fileName = 'data.json';
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', fileName);
        linkElement.click();
    }
}

// export {IdxDataSet};
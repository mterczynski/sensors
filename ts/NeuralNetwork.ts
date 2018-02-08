export class NeuralNetwork{
    readonly inputSize = 5;  
    readonly outputSize = 1;

    // private weights = new Array(5).fill(0).map((el)=>Math.random()*200-100);
    private weights = [
        Math.random()*200-100,
        Math.random()*200-100,
        0,
        Math.random()*200-100,
        Math.random()*200-100
    ]
    
    getWeights(){
        return this.weights;
    }
    evaluate(inputs: Array<number>): number{
        if(inputs.length != this.inputSize){
            throw new Error('Expected 5 numerical inputs');
        }
        
        let sum = 0;
        inputs.forEach((input, index)=>{
            sum += input * this.weights[index];
        });

        return sum;
    }
}
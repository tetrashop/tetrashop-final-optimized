// 📁 projects/quantum/simulator.js
class QuantumSimulator {
  constructor() {
    this.qubits = [];
    this.gates = new QuantumGates();
  }

  initializeQubit(state = [1, 0]) {
    // |0⟩ = [1, 0], |1⟩ = [0, 1]
    this.qubits.push({
      state: state,
      history: []
    });
  }

  applyGate(qubitIndex, gate) {
    const qubit = this.qubits[qubitIndex];
    const newState = this.gates.apply(gate, qubit.state);
    
    qubit.state = newState;
    qubit.history.push({ gate, state: newState });
    
    return this.calculateProbabilities(newState);
  }

  calculateProbabilities(state) {
    const [alpha, beta] = state;
    return {
      |0⟩: Math.pow(Math.abs(alpha), 2),
      |1⟩: Math.pow(Math.abs(beta), 2)
    };
  }
}

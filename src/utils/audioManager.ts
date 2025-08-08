class AudioManager {
  private audioContext: AudioContext | null = null;
  private fanOscillator: OscillatorNode | null = null;
  private fanGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private motorOscillator: OscillatorNode | null = null;
  private motorGain: GainNode | null = null;
  private isInitialized = false;
  private currentFrequency = 220;
  private currentFanType = 'table';

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  }

  async startFanSound(baseFreq: number, noiseType: 'white' | 'brown' | 'pink' = 'white', fanType: string = 'table') {
    if (!this.audioContext) await this.initialize();
    if (!this.audioContext) return;

    this.stopFanSound();
    this.currentFanType = fanType;

    // Create main oscillator for blade whoosh
    this.fanOscillator = this.audioContext.createOscillator();
    this.fanGain = this.audioContext.createGain();
    this.filterNode = this.audioContext.createBiquadFilter();

    // Create motor hum oscillator
    this.motorOscillator = this.audioContext.createOscillator();
    this.motorGain = this.audioContext.createGain();

    // Configure based on fan type
    this.configureFanByType(fanType, baseFreq);

    // Connect main fan sound
    this.fanOscillator.connect(this.filterNode);
    this.filterNode.connect(this.fanGain);
    this.fanGain.connect(this.audioContext.destination);

    // Connect motor sound
    this.motorOscillator.connect(this.motorGain);
    this.motorGain.connect(this.audioContext.destination);

    // Add realistic noise buffer
    this.addRealisticNoiseBuffer(noiseType, fanType);

    // Start oscillators
    this.fanOscillator.start();
    this.motorOscillator.start();
    this.currentFrequency = baseFreq;
  }

  private configureFanByType(fanType: string, baseFreq: number) {
    if (!this.audioContext || !this.fanOscillator || !this.motorOscillator || !this.filterNode) return;

    const now = this.audioContext.currentTime;

    switch (fanType) {
      case 'table':
        // Table fan: Higher pitched, cleaner sound
        this.fanOscillator.frequency.setValueAtTime(baseFreq * 0.4, now);
        this.fanOscillator.type = 'sawtooth';
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(baseFreq * 3, now);
        this.filterNode.Q.setValueAtTime(1.2, now);
        
        // Motor hum
        this.motorOscillator.frequency.setValueAtTime(baseFreq * 0.15, now);
        this.motorOscillator.type = 'sine';
        this.motorGain.gain.setValueAtTime(0, now);
        break;

      case 'ceiling':
        // Ceiling fan: Lower, more whooshing sound
        this.fanOscillator.frequency.setValueAtTime(baseFreq * 0.25, now);
        this.fanOscillator.type = 'triangle';
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(baseFreq * 1.8, now);
        this.filterNode.Q.setValueAtTime(0.8, now);
        
        // Deeper motor hum
        this.motorOscillator.frequency.setValueAtTime(baseFreq * 0.1, now);
        this.motorOscillator.type = 'sine';
        this.motorGain.gain.setValueAtTime(0, now);
        break;

      case 'rusty':
        // Old rusty fan: Irregular, rattling sound
        this.fanOscillator.frequency.setValueAtTime(baseFreq * 0.3, now);
        this.fanOscillator.type = 'square';
        this.filterNode.type = 'bandpass';
        this.filterNode.frequency.setValueAtTime(baseFreq * 1.5, now);
        this.filterNode.Q.setValueAtTime(2.5, now);
        
        // Louder, irregular motor
        this.motorOscillator.frequency.setValueAtTime(baseFreq * 0.12, now);
        this.motorOscillator.type = 'sawtooth';
        this.motorGain.gain.setValueAtTime(0, now);
        break;

      case 'modern':
        // Modern fan: Very clean, high-tech sound
        this.fanOscillator.frequency.setValueAtTime(baseFreq * 0.5, now);
        this.fanOscillator.type = 'sine';
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(baseFreq * 4, now);
        this.filterNode.Q.setValueAtTime(0.3, now);
        
        // Almost silent motor
        this.motorOscillator.frequency.setValueAtTime(baseFreq * 0.08, now);
        this.motorOscillator.type = 'sine';
        this.motorGain.gain.setValueAtTime(0, now);
        break;
    }

    // Set initial gains to 0
    this.fanGain.gain.setValueAtTime(0, now);
  }

  private addRealisticNoiseBuffer(noiseType: 'white' | 'brown' | 'pink', fanType: string) {
    if (!this.audioContext) return;

    const bufferSize = this.audioContext.sampleRate * 3;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      
      // Add irregularities for rusty fan
      if (fanType === 'rusty' && Math.random() < 0.001) {
        white += (Math.random() - 0.5) * 0.8; // Random spikes
      }
      
      if (noiseType === 'brown') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.15;
        b6 = white * 0.115926;
      } else if (noiseType === 'pink') {
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.08;
      } else {
        output[i] = white * 0.12;
      }

      // Fan-specific modifications
      switch (fanType) {
        case 'ceiling':
          output[i] *= 0.7; // Softer noise
          break;
        case 'rusty':
          output[i] *= 1.3; // More noise
          if (i % 1000 < 50) output[i] *= 1.5; // Periodic rattling
          break;
        case 'modern':
          output[i] *= 0.4; // Very quiet
          break;
      }
    }

    this.noiseSource = this.audioContext.createBufferSource();
    this.noiseGain = this.audioContext.createGain();
    
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;
    this.noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    
    this.noiseSource.connect(this.noiseGain);
    this.noiseGain.connect(this.audioContext.destination);
    this.noiseSource.start();
  }

  updateSpeed(speed: 'slow' | 'medium' | 'high') {
    if (!this.audioContext || !this.fanOscillator || !this.filterNode || !this.motorOscillator) return;

    const speedMultipliers = {
      slow: 0.6,
      medium: 1.0,
      high: 1.6
    };

    const multiplier = speedMultipliers[speed];
    const newFreq = this.currentFrequency * multiplier;
    const now = this.audioContext.currentTime;
    
    // Update main fan sound
    this.fanOscillator.frequency.exponentialRampToValueAtTime(
      newFreq * (this.currentFanType === 'ceiling' ? 0.25 : 
                 this.currentFanType === 'rusty' ? 0.3 :
                 this.currentFanType === 'modern' ? 0.5 : 0.4), 
      now + 0.5
    );
    
    // Update filter
    this.filterNode.frequency.exponentialRampToValueAtTime(
      newFreq * (this.currentFanType === 'ceiling' ? 1.8 :
                 this.currentFanType === 'rusty' ? 1.5 :
                 this.currentFanType === 'modern' ? 4 : 3), 
      now + 0.5
    );

    // Update motor sound
    this.motorOscillator.frequency.exponentialRampToValueAtTime(
      newFreq * (this.currentFanType === 'ceiling' ? 0.1 :
                 this.currentFanType === 'rusty' ? 0.12 :
                 this.currentFanType === 'modern' ? 0.08 : 0.15), 
      now + 0.5
    );

    // Adjust motor volume based on speed
    const motorVolume = this.currentFanType === 'rusty' ? multiplier * 0.15 : multiplier * 0.08;
    this.motorGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, motorVolume), 
      now + 0.5
    );
  }

  setVolume(volume: number) {
    if (!this.audioContext || !this.fanGain || !this.noiseGain) return;
    
    const now = this.audioContext.currentTime;
    
    // Base volume multipliers for different fan types
    const volumeMultipliers = {
      table: 0.6,
      ceiling: 0.5,
      rusty: 0.8,
      modern: 0.3
    };
    
    const baseMultiplier = volumeMultipliers[this.currentFanType as keyof typeof volumeMultipliers] || 0.5;
    const finalVolume = Math.max(0.001, volume * baseMultiplier);
    
    this.fanGain.gain.exponentialRampToValueAtTime(finalVolume, now + 0.1);
    this.noiseGain.gain.exponentialRampToValueAtTime(finalVolume * 0.7, now + 0.1);
  }

  fadeIn(duration: number = 1.0) {
    if (!this.audioContext || !this.fanGain || !this.noiseGain || !this.motorGain) return;
    
    const now = this.audioContext.currentTime;
    const volumeMultipliers = {
      table: 0.5,
      ceiling: 0.4,
      rusty: 0.7,
      modern: 0.25
    };
    
    const baseMultiplier = volumeMultipliers[this.currentFanType as keyof typeof volumeMultipliers] || 0.4;
    
    this.fanGain.gain.setValueAtTime(0.001, now);
    this.fanGain.gain.exponentialRampToValueAtTime(baseMultiplier, now + duration);
    
    this.noiseGain.gain.setValueAtTime(0.001, now);
    this.noiseGain.gain.exponentialRampToValueAtTime(baseMultiplier * 0.6, now + duration);
    
    this.motorGain.gain.setValueAtTime(0.001, now);
    this.motorGain.gain.exponentialRampToValueAtTime(
      this.currentFanType === 'rusty' ? 0.12 : 0.06, 
      now + duration
    );
  }

  fadeOut(duration: number = 1.0): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.fanGain || !this.noiseGain || !this.motorGain) {
        resolve();
        return;
      }
      
      const now = this.audioContext.currentTime;
      
      this.fanGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      this.motorGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      setTimeout(() => {
        this.stopFanSound();
        resolve();
      }, duration * 1000);
    });
  }

  stopFanSound() {
    try {
      if (this.fanOscillator) {
        this.fanOscillator.stop();
        this.fanOscillator = null;
      }
      if (this.motorOscillator) {
        this.motorOscillator.stop();
        this.motorOscillator = null;
      }
      if (this.noiseSource) {
        this.noiseSource.stop();
        this.noiseSource = null;
      }
    } catch (error) {
      // Ignore errors when stopping already stopped sources
    }
    
    this.fanGain = null;
    this.filterNode = null;
    this.noiseGain = null;
    this.motorGain = null;
  }

  // Enhanced text-to-speech for Alexa-style voice
  speak(text: string) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;
    
    // Try to find a suitable voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('female') ||
      voice.lang.includes('en-US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
  }

  cleanup() {
    this.stopFanSound();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}

export const audioManager = new AudioManager();
// 全局音频流实例
const audioStream = new MediaStream()
const ctx = new (unsafeWindow.AudioContext || unsafeWindow.webkitAudioContext)()

// 噪声强度，可调节（0-1之间，0表示无噪声，1表示最大噪声）
let noiseLevel = 0.05

// 设置噪声强度的函数
export function setNoiseLevel(level) {
    noiseLevel = Math.max(0, Math.min(1, level)); // 确保值在0-1之间
    console.log(`噪声强度设置为: ${noiseLevel}`);
}

export function switchToSilentAudioStream() {
    try {
        // 直接使用主音频上下文，而不是离线上下文
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // 填充适当音量的白噪声
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = (Math.random() * 2 - 1) * noiseLevel; // 使用全局噪声级别
        }
        
        // 创建噪声源
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        
        // 创建增益节点控制音量
        const gainNode = ctx.createGain();
        gainNode.gain.value = noiseLevel; // 使用全局噪声级别
        
        // 连接节点
        noiseSource.connect(gainNode);
        const destination = ctx.createMediaStreamDestination();
        gainNode.connect(destination);
        
        // 启动噪声源
        noiseSource.start();
        
        const track = destination.stream.getAudioTracks()[0];
        
        // 设置正确的音轨属性以支持录音
        if (track) {
            // 添加必要的属性和方法以模拟真实麦克风
            Object.defineProperties(track, {
                label: { value: 'Virtual Microphone (White Noise)' },
                kind: { value: 'audio' },
                readyState: { value: 'live' },
                muted: { value: false },
                enabled: { value: true, writable: true }
            });
            console.log('已创建白噪声音频流，噪声级别:', noiseLevel);
        } else {
            console.error('无法获取音频轨道');
            return;
        }
        
        // 清除现有的音轨
        Array.from(audioStream.getTracks()).forEach(track => audioStream.removeTrack(track));
        audioStream.addTrack(track);
    } catch (error) {
        console.error('切换到白噪声流时发生错误:', error);
    }
}

export function initMicHook() {
    // 先初始化白噪声流
    switchToSilentAudioStream();
    
    // Hook MediaDevices API
    if (unsafeWindow.navigator?.mediaDevices) {
        const mediaDevices = unsafeWindow.navigator.mediaDevices;
        const originalGetUserMedia = mediaDevices.getUserMedia;
        
        try {
            mediaDevices.getUserMedia = async function(constraints) {
                console.log('拦截 MediaDevices.getUserMedia:', constraints);
                if (constraints?.audio) {
                    console.log('返回虚拟音频流');
                    return Promise.resolve(audioStream);
                }
                return originalGetUserMedia.apply(this, arguments);
            };
            
            console.log('成功初始化音频流钩子');
        } catch (error) {
            console.error('初始化音频流钩子时发生错误:', error);
        }
    } else {
        console.warn('MediaDevices API 不可用');
    }
}

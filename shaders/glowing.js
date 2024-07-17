AFRAME.registerShader('glowing', {
    schema: {
        color1: { type: 'color', is: 'uniform' },
        color2: { type: 'color', is: 'uniform' },
        time: { type: 'time', is: 'uniform' },
        uMap: { type: 'map', is: 'uniform' },
    },
    vertexShader: `
        precision highp float;
        varying vec3 fNormal;
        varying vec2 vUv;
        
        void main() {
            fNormal = normalize(normalMatrix * normal);
            vUv = uv;
            vec4 pos = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * pos;
        }
    `,
    fragmentShader: `
        precision highp float;
        varying vec3 fNormal;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        uniform sampler2D uMap;
        varying vec2 vUv;
        
        void main() {
            float theta = time / 1000.0;
            
            vec3 dir1 = vec3(cos(theta), 0, sin(theta));
            vec3 dir2 = vec3(sin(theta), 0, cos(theta));
            
            float diffuse1 = pow(dot(fNormal, dir1), 2.0);
            float diffuse2 = pow(dot(fNormal, dir2), 2.0);
            
            vec3 texturePixel = texture2D(uMap, vUv).rgb;
            
            vec3 col1 = diffuse2 * color1;
            //vec3 col2 = diffuse1 * color2;
            vec3 col2 = diffuse1 * texturePixel;
            
            float alpha = 0.5 + 0.5 * sin(theta);
            
            gl_FragColor = vec4(col1 + col2, alpha);
        }
    `,
})
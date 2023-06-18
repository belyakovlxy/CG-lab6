//====================== FIRE  =============================

let fireVsShader = [
    'attribute vec3 a_Position;' +
    '' +
    'uniform mat4 u_mWorld;' +
    'uniform mat4 u_mView;' +
    'uniform mat4 u_mProj;' +
    'uniform vec3 u_initPosition;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'void main()' +
    '{' +
    '   gl_Position = u_mProj * u_mView * u_mWorld * vec4(a_Position, 1.0);' +
    '   float xQ = (a_Position[0] - u_initPosition[0]) * (a_Position[0] - u_initPosition[0]) / 0.7 / 0.7;' +
    '   float yQ = (a_Position[1] - u_initPosition[1]) * (a_Position[1] - u_initPosition[1]) / 1.5 / 1.5;' +
    '   float zQ = (a_Position[2] - u_initPosition[2]) * (a_Position[2] - u_initPosition[2]) / 0.7 / 0.7;' +
    '   ' +
    '   float coef = (xQ + yQ + zQ);' +
    '' +
    '   if (coef > 0.7)' +
    '   {' +
    '       v_color = vec3(1.0, 0.22, 0.0);' +
    '   }' +
    '   else if (coef > 0.5)' +
    '   {' +
    '       v_color = vec3(1.0, 0.28, 0.01);' +
    '   }' +
    '   else if (coef > 0.1)' +
    '   {' +
    '       v_color = vec3(1.0, 0.67, 0.01);' +
    '   }' +
    '   else' +
    '   {' +
    '       v_color = vec3(1.0, 1.0, 0.0);' +
    '   }' +
    '' +
    '   gl_PointSize = 10.0;' +
    '}'
]

let fireFsShader = [
    'precision mediump float;' +
    '' +
    'uniform vec3 u_Color;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'void main()' +
    '{' +
    '' +
    '   gl_FragColor = vec4(v_color, 1.0);' +
    '}'
]

//======================  FOG  =============================

let fogVsShader = [
    'attribute vec3 a_Position;' +
    '' +
    'uniform mat4 u_mWorld;' +
    'uniform mat4 u_mView;' +
    'uniform mat4 u_mProj;' +
    '' +
    'void main()' +
    '{' +
    '   gl_Position = u_mProj * u_mView * u_mWorld * vec4(a_Position, 1.0);' +
    '' +
    '   gl_PointSize = 70.0;' +
    '}'
]

let fogFsShader = [
    'precision mediump float;' +
    '' +
    'uniform sampler2D u_texture;' +
    '' +
    'void main()' +
    '{' +
    '   gl_FragColor = texture2D(u_texture, gl_PointCoord);' +
    '}'
]

//==================  FIREWORKS  ===========================

let fireWorkVsShader = [
    'attribute vec3 a_Position;' +
    '' +
    'uniform mat4 u_mWorld;' +
    'uniform mat4 u_mView;' +
    'uniform mat4 u_mProj;' +
    '' +
    'uniform vec3 u_firstColor;' +
    'uniform vec3 u_secondColor;' +
    'uniform float u_procPercentage;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'void main()' +
    '{' +
    '   v_color = (u_firstColor * (1.0 - u_procPercentage) + u_secondColor * u_procPercentage) * (1.0 - u_procPercentage);' +
    '   gl_Position = u_mProj * u_mView * u_mWorld * vec4(a_Position, 1.0);' +
    '' +
    '   gl_PointSize = 2.0;' +
    '}'
]

let fireWorkFsShader = [
    'precision mediump float;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'void main()' +
    '{' +
    '   gl_FragColor = vec4(v_color, 1.0);' +
    '}'
]

// ======================  SPARKS ================================

let particleVsShader = [
    'attribute vec3 a_Position;' +
    '' +
    'uniform mat4 u_mWorld;' +
    'uniform mat4 u_mView;' +
    'uniform mat4 u_mProj;' +
    '' +
    'void main()' +
    '{' +
    '   gl_Position = u_mProj * u_mView * u_mWorld * vec4(a_Position, 1.0);' +
    '' +
    '   gl_PointSize = 40.0;' +
    '}'
]

let particleFsShader = [
    'precision mediump float;' +
    '' +
    'uniform sampler2D u_texture;' +
    '' +
    'void main()' +
    '{' +
    '   gl_FragColor = texture2D(u_texture, gl_PointCoord);' +
    '}'
    ]

let traceVsShader = [
    'attribute vec3 a_PositionTrace;' +
    'attribute vec3 a_color;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'uniform mat4 u_mWorld;' +
    'uniform mat4 u_mView;' +
    'uniform mat4 u_mProj;' +
    '' +
    'void main()' +
    '{' +
    '   v_color = a_color;' +
    '   gl_Position = u_mProj * u_mView * u_mWorld * vec4(a_PositionTrace, 1.0);' +
    '}'
]

let traceFsShader = [
    'precision mediump float;' +
    '' +
    'varying vec3 v_color;' +
    '' +
    'void main()' +
    '{' +
    '   gl_FragColor = vec4(v_color, 1.0);' +
    '}'
]


let vsSource =
    [
        'precision mediump float;',
        'attribute vec3 vertPositions;',
        'attribute vec3 vertColor;',
        'attribute vec3 vertNormal;',
        'attribute vec2 vertTexCoords;',

        'varying vec3 fragColor;',
        'varying vec3 fragPosition;',
        'varying vec3 fragNormal;',
        'varying vec2 fragTexCoords;',
        '',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        'uniform vec3 cubeColor;',
        'uniform mat4 u_normalMatrix;',
        '',
        'uniform vec3 u_viewDirection;',
        'uniform vec3 u_sourceDirection;',
        'uniform vec3 u_sourceDiffuseColor;',
        'uniform vec3 u_sourceSpecularColor;',
        'uniform vec3 u_sourceAmbientColor;',
        'uniform bool u_isGouraud;',
        'uniform bool u_isLambert;',
        '',
        'const vec3 centerPos = vec3(0.0, 0.0, 0.0);',
        '',
        'void main()',
        '{',
            'fragTexCoords = vertTexCoords;',
        '   gl_Position = mProj * mView * mWorld * vec4(vertPositions, 1.0);',
        '',
            'vec3 N = normalize(vertNormal);',
            'fragNormal = (u_normalMatrix * vec4(vertNormal,1.0)).xyz;',
        '',
        '    vec3 vertPos = (mView * mWorld*vec4(vertPositions,1.0)).xyz;',
            '',
            'if (u_isGouraud)',
            '{',
                'vec3 vertexNormal = normalize(vertPositions - centerPos);',
                'vertexNormal = (u_normalMatrix * vec4(vertexNormal, 1.0)).xyz;',
                'vec3 lightDir = normalize(u_sourceDirection - vertPos);',
                'fragColor = (u_sourceAmbientColor + max(0.0,dot(vertexNormal,lightDir))) * cubeColor;',
                'return;',
            '}',
            '',
            'if (u_isLambert)',
            '{',
                'vec3 lightDir = normalize(u_sourceDirection - vertPos);',
                'fragColor = (u_sourceAmbientColor + max(0.0,dot(fragNormal,lightDir))) * cubeColor;',
                'return;',
            '}',
        '   fragColor = cubeColor;',

        '   fragPosition = vertPos;',

        '}',
    ].join('\n');

let fsSource =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'varying vec3 fragPosition;',
        'varying vec3 fragNormal;',
        'varying vec2 fragTexCoords;',
        '',
        'uniform vec3 u_viewDirection;',
        'uniform vec3 u_sourceDirection;',
        'uniform float u_shininess;',
        'uniform bool u_isPhong;',
        'uniform bool u_isBlinn;',
        'uniform bool u_isGouraud;',
        'uniform bool u_isLambert;',
        'uniform bool u_isToon;',
        '',
        'uniform vec3 u_sourceDiffuseColor;',
        'uniform vec3 u_sourceSpecularColor;',
        'uniform vec3 u_sourceAmbientColor;',

        'uniform float u_coefTex;',
        'uniform float u_coefColor;',
        'uniform bool u_blended;',

        'uniform sampler2D u_sampler1;',
        'uniform sampler2D u_sampler2;',
        '',
        'const vec3 rimColor = vec3(1.0, 1.0, 1.0);',
        'const float rimAmount = 0.716;',
        '',
        '',
        'void main()',
        '{',
            'vec3 color = vec3(0.0, 0.0, 0.0);',
            'vec3 lightDir = normalize(u_sourceDirection - fragPosition);',
            'vec3 viewDir = normalize(u_viewDirection);',
            'float spec = 0.0;',

            'if (u_isLambert)',
            '{',
                'color = fragColor;',
            '}',
            '',
            'if (u_isGouraud)',
            '{',
                'color = fragColor;',
            '}',

            'if (u_isToon)',
            '{',
                'float NdotL = dot(fragNormal,lightDir);',
                'float lightIntensity = 0.0;',

                'if (NdotL > 0.1)' +
                '{' +
                    'lightIntensity = 0.7;' +
                '}' +
                'else' +
                '{' +
                    'lightIntensity = 0.3;' +
                '}',

                'vec3 srcAmbiemt = vec3(0.4, 0.4, 0.4);',

                'vec3 halfwayDir = normalize(lightDir + viewDir);',
                'spec = pow(max(dot(fragNormal, halfwayDir), 0.0), u_shininess * u_shininess);',
                'float specularIntensitySmooth = smoothstep(0.005, 0.01, spec);',

                'float rimDot = 1.0 - dot(viewDir, fragNormal);',
                '//float rimIntensity = smoothstep(rimAmount - 0.01, rimAmount + 0.01, rimDot);',
                '//vec3 rim = rimIntensity * rimColor;',

                'color = (lightIntensity + u_sourceAmbientColor + specularIntensitySmooth * u_sourceSpecularColor );',
            '}',

            'if (u_isBlinn)',
            '{',
                'vec3 halfwayDir = normalize(lightDir + viewDir);',
                'spec = pow(max(dot(fragNormal, halfwayDir), 0.0), u_shininess * u_shininess);',
                'color = (spec * u_sourceSpecularColor + u_sourceAmbientColor + u_sourceDiffuseColor * max(0.0,dot(fragNormal,lightDir)));',
            '}',
            'if (u_isPhong)',
            '{',
                'vec3 reflectDir = normalize(reflect(-lightDir,fragNormal));',
                'spec = pow(max(dot(viewDir,reflectDir), 0.0), u_shininess * u_shininess);',
                'color = (spec * u_sourceSpecularColor + u_sourceAmbientColor + u_sourceDiffuseColor * max(0.0,dot(fragNormal,lightDir)));',
            '}',
        '',
            'if (u_blended)' +
            '{' +
                'vec4 texColor = texture2D(u_sampler1, fragTexCoords) * texture2D(u_sampler2, fragTexCoords);' +
                'gl_FragColor = vec4(color, 1.0) * texColor * vec4(fragColor, 1.0);' +
            '}' +
            'else' +
            '{' +
                'vec4 texColor = (1.0 - u_coefTex) * texture2D(u_sampler1, fragTexCoords) + u_coefTex * texture2D(u_sampler2, fragTexCoords);' +
                'gl_FragColor = vec4(color, 1.0) * ((1.0 - u_coefColor) * texColor + u_coefColor * vec4(fragColor, 1.0));' +
            '}',


        '}',
    ].join('\n');
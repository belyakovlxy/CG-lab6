console.log("Script is running")

let canvas = document.getElementById("pedestal");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



initWebGl(canvas);
console.log(gl)


gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);



let imgSRC = "src/textures/spark.png";
let texture = gl.createTexture();
let image = new Image();
image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
image.src = imgSRC;

let imgSRCSmoke = "src/textures/smoke.png";
let textureSmoke = gl.createTexture();
let imageSmoke = new Image();
imageSmoke.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textureSmoke);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSmoke);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
imageSmoke.src = imgSRCSmoke;

//
//====================================SPARKS============================================================================
//

class Spark
{
    constructor() {
        this.currentTime = performance.now();

        this.angle = Math.random() * 360;
        this.maxRad = Math.random() * 1.5;

        this.xMax = this.maxRad * Math.cos(radians_to_degrees(this.angle));
        this.yMax = this.maxRad * Math.sin(radians_to_degrees(this.angle));

        let multiplier = 125 + Math.random() * 125;

        this.dx = this.xMax / multiplier;
        this.dy = this.yMax / multiplier;

        this.x = (this.dx * 1000) % this.xMax;
        this.y = (this.dy * 1000) % this.yMax;
    }

    init()
    {
        this.currentTime = performance.now();

        this.angle = Math.random() * 360;
        this.maxRad = Math.random() * 1.5;

        this.xMax = this.maxRad * Math.cos(radians_to_degrees(this.angle));
        this.yMax = this.maxRad * Math.sin(radians_to_degrees(this.angle));

        let multiplier = 125 + Math.random() * 125;

        this.dx = this.xMax / multiplier;
        this.dy = this.yMax / multiplier;

        this.x = 0;
        this.y = 0;
    }

    move(time)
    {
        let timeShift = time - this.currentTime;
        this.currentTime = time;

        let speed = timeShift;
        this.x += this.dx * speed;
        this.y += this.dy * speed;

        if (Math.abs(this.x) > Math.abs(this.xMax) || Math.abs(this.y) > Math.abs(this.yMax)) {
            this.init();

        }
    }
}


class SparkSystem
{
    constructor(count) {
        this.sparks = []
        this.sparkCoords = [];
        this.traceCoords = [];

        let spark;
        for (let i = 0; i < count; ++i)
        {
            spark = new Spark();
            this.sparkCoords.push(spark.x, spark.y, 0.0);

            this.traceCoords.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
            this.traceCoords.push(spark.x, spark.y, 0.0, 1.0, 0.78, 0.33);
            this.sparks.push(spark);
        }
    }

    move()
    {
        this.sparkCoords = [];
        this.traceCoords = [];
        for (let i = 0; i < this.sparks.length; ++i)
        {
            this.sparks[i].move(performance.now());

            this.sparkCoords.push(this.sparks[i].x, this.sparks[i].y, 0.0);

            this.traceCoords.push(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
            this.traceCoords.push(this.sparks[i].x, this.sparks[i].y, 0.0, 1.0, 0.78, 0.33);
        }
    }
}

n = 200;
let sparkSystem = new SparkSystem(n);

//
//=================================  BIND PARTICLE SHADER ==========================
//

let particleShaderProgram = initShaderProgram(gl, particleVsShader, particleFsShader);
gl.useProgram(particleShaderProgram);

//
//  Bind cube buffer
//

initBuffer(gl, particleVertices, gl.ARRAY_BUFFER, Float32Array);
//
//  Set buffer data to attributes
//
let a_Positon = enableVertexAttrib(
    particleShaderProgram,
    "a_Position",
    3, 0, 0);
gl.enableVertexAttribArray(a_Positon);


//=========================== UNIFORMS ========================================

//-------------------------MATRICES----------------------------------------

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


let worldMatrix = new Float32Array(16);
let viewMatrix = new Float32Array(16);
let projMatrix = new Float32Array(16);

glMatrix.mat4.identity(worldMatrix)
glMatrix.mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrix, getRadAngle(45), canvas.width / canvas.height, 0.1, 1000.0);

let u_mWorld = gl.getUniformLocation(particleShaderProgram, "u_mWorld");
let u_mView = gl.getUniformLocation(particleShaderProgram, "u_mView");
let u_mProj = gl.getUniformLocation(particleShaderProgram, "u_mProj");

gl.uniformMatrix4fv(u_mWorld, false, worldMatrix);
gl.uniformMatrix4fv(u_mView, false, viewMatrix);
gl.uniformMatrix4fv(u_mProj, false, projMatrix);

//--------------------------------TEXTURE--------------------------------------

particleShaderProgram.samplerUniform = gl.getUniformLocation(particleShaderProgram, "u_texture");
gl.uniform1i(particleShaderProgram.samplerUniform, 0);



//
//=================================  BIND TRACE SHADER ==========================
//


let traceShaderProgram = initShaderProgram(gl, traceVsShader, traceFsShader);
gl.useProgram(traceShaderProgram);

initBuffer(gl, traceVertices, gl.ARRAY_BUFFER, Float32Array);

let a_TracePosition = enableVertexAttrib(
    traceShaderProgram,
    "a_PositionTrace",
    3, 6, 0);
gl.enableVertexAttribArray(a_TracePosition);

let a_TraceColor = enableVertexAttrib(
    traceShaderProgram,
    "a_color",
    3, 6, 3);
gl.enableVertexAttribArray(a_TraceColor);

//=========================== UNIFORMS ========================================

//-------------------------MATRICES----------------------------------------

let u_mWorldTrace = gl.getUniformLocation(traceShaderProgram, "u_mWorld");
let u_mViewTrace = gl.getUniformLocation(traceShaderProgram, "u_mView");
let u_mProjTrace = gl.getUniformLocation(traceShaderProgram, "u_mProj");

gl.uniformMatrix4fv(u_mWorldTrace, false, worldMatrix);
gl.uniformMatrix4fv(u_mViewTrace, false, viewMatrix);
gl.uniformMatrix4fv(u_mProjTrace, false, projMatrix);


//
//=====================================  DRAW  SPARKS  ================================
//

function drawSparks()
{
    sparkSystem.move();

    initBuffer(gl, sparkSystem.sparkCoords, gl.ARRAY_BUFFER, Float32Array);

    a_Positon = enableVertexAttrib(
        particleShaderProgram,
        "a_Position",
        3, 0, 0);
    gl.enableVertexAttribArray(a_Positon);
    gl.useProgram(particleShaderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.POINTS, 0, n);

    initBuffer(gl, sparkSystem.traceCoords, gl.ARRAY_BUFFER, Float32Array);
    a_TracePosition = enableVertexAttrib(
        traceShaderProgram,
        "a_PositionTrace",
        3, 6, 0);
    a_TraceColor = enableVertexAttrib(
        traceShaderProgram,
        "a_color",
        3, 6, 3);
    gl.enableVertexAttribArray(a_TracePosition);
    gl.useProgram(traceShaderProgram);
    gl.drawArrays(gl.LINES, 0, 2 * n);
}


//===============================  FIREWORKS =========================================

class FireWorks
{
    constructor( sliceCount = 10, sparkCountPerSlice = 10, x = 0, y = 0, z = 0, firstColor = [1.0, 1.0, 1.0], secondColor = [1.0, 1.0, 1.0]) {
        this.radius = 0.01;
        this.maxRadius = 2.0;
        this.sliceCount = sliceCount;
        this.sparkCountPerSlice = sparkCountPerSlice;

        this.firstColor = firstColor;
        this.secondColor = secondColor;
        this.lifeCycle = this.radius / this.maxRadius;


        this.x = x;
        this.y = y;
        this.z = z;

        this.fireWorksCoord = [];
        this.createSphere();
    }

    createSphere()
    {
        this.fireWorksCoord = [];
        this.fireWorksCoord.push(this.x, this.radius + this.y, this.z);

        this.lifeCycle = this.radius / this.maxRadius;

        let sliceAngleDelta = Math.PI / this.sliceCount;
        let sparkAngleDelta = 2 * Math.PI / this.sparkCountPerSlice;

        let sparkAngle;
        let sliceAngle = 0;
        for (let i = 0; i < this.sliceCount; ++i)
        {
            sparkAngle = sparkAngleDelta;
            sliceAngle += sliceAngleDelta;
            for (let j = 0; j < this.sparkCountPerSlice; ++j)
            {
                this.fireWorksCoord.push(
                    -this.radius * Math.cos(sparkAngle) * Math.sin(sliceAngle) + this.x,
                    this.radius * Math.cos(sliceAngle) + this.y,
                    this.radius * Math.sin(sparkAngle) * Math.sin(sliceAngle) + this.z);

                sparkAngle += sparkAngleDelta;
            }
        }
        this.fireWorksCoord.push(this.x, -this.radius + this.y, this.z);
    }

    move()
    {
        this.radius += 0.005;

        if (this.radius > 2.0)
        {
            this.radius = 0.001;
            this.x = Math.random() * 4 - 2
            this.y = Math.random() * 2 - 1
            this.z = Math.random() * 3 - 5

            this.firstColor = [Math.random(), Math.random(), Math.random()]
            this.secondColor  = [Math.random(), Math.random(), Math.random()]
        }


        this.createSphere();
    }
}

// ---------------------------  FIREWORKS SHADER PROGRAM ----------------------

let fireWorksShaderProgram = initShaderProgram(gl, fireWorkVsShader, fireWorkFsShader);
gl.useProgram(fireWorksShaderProgram);

initBuffer(gl, null, gl.ARRAY_BUFFER, Float32Array);

let a_FireWorksPosition = enableVertexAttrib(
    fireWorksShaderProgram,
    "a_Position",
    3, 0, 0);
gl.enableVertexAttribArray(a_FireWorksPosition);


// --------------------------- FIREWORKS UNIFORMS ------------------------------

let u_mWorldTFireWorks= gl.getUniformLocation(fireWorksShaderProgram, "u_mWorld");
let u_mViewFireWorks = gl.getUniformLocation(fireWorksShaderProgram, "u_mView");
let u_mProjFireWorks = gl.getUniformLocation(fireWorksShaderProgram, "u_mProj");

gl.uniformMatrix4fv(u_mWorldTFireWorks, false, worldMatrix);
gl.uniformMatrix4fv(u_mViewFireWorks, false, viewMatrix);
gl.uniformMatrix4fv(u_mProjFireWorks, false, projMatrix);

let u_firstColor = gl.getUniformLocation(fireWorksShaderProgram, "u_firstColor");
gl.uniform3fv(u_firstColor, [1.0, 0.0, 0.0]);

let u_secondColor = gl.getUniformLocation(fireWorksShaderProgram, "u_secondColor");
gl.uniform3fv(u_secondColor, [1.0, 0.0, 1.0]);

let u_procPercentage =gl.getUniformLocation(fireWorksShaderProgram, "u_procPercentage");
gl.uniform1f(u_procPercentage, 0);




let slices = 30;
let sparkPerSlice = 50;
let fireWorks = new FireWorks(slices, sparkPerSlice, 0.0, 0.0, -3.0, [1.0, 1.0, 0.0], [1.0, 0.0, 1.0]);
let fireWorks2 = new FireWorks(slices, sparkPerSlice, 1.0, 0.5, -4.0, [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]);
let fireWorks3 = new FireWorks(slices, sparkPerSlice, 2.0, -1.0, -2.0, [0.0, 1.0, 0.0], [0.0, 1.0, 1.0]);
let fireWorks4 = new FireWorks(slices, sparkPerSlice, -1.0, -0.5, -5.0, [1.0, 1.0, 0.0], [0.0, 1.0, 1.0]);
let fireWorks5 = new FireWorks(slices, sparkPerSlice, -2.0, 1.0, -3.0, [1.0, 1.0, 1.0], [1.0, 0.0, 1.0]);


function drawFireWorks(fWorks)
{
    initBuffer(gl, fWorks.fireWorksCoord, gl.ARRAY_BUFFER, Float32Array);

    a_FireWorksPosition = enableVertexAttrib(
        fireWorksShaderProgram,
        "a_Position",
        3, 0, 0);
    gl.enableVertexAttribArray(a_FireWorksPosition);

    gl.useProgram(fireWorksShaderProgram);
    gl.uniform1f(u_procPercentage, fWorks.lifeCycle);
    gl.uniform3fv(u_firstColor, fWorks.firstColor);
    gl.uniform3fv(u_secondColor, fWorks.secondColor);
    fWorks.move();


    gl.drawArrays(gl.POINTS, 0, 2 + slices * sparkPerSlice );
}

function drawAllFireWorks(initTime)
{
    drawFireWorks(fireWorks);

    if (performance.now() > initTime + 1000)
        drawFireWorks(fireWorks2);

    if (performance.now() > initTime + 2000)
        drawFireWorks(fireWorks3);

    if (performance.now() > initTime + 3000)
        drawFireWorks(fireWorks4);

    if (performance.now() > initTime + 4000)
        drawFireWorks(fireWorks5);
}

//
//========================== FOG ======================================================
//

class FogParticle
{
    constructor() {
        this.initTime = performance.now();

        this.angle = 2 * Math.PI * Math.random();
        this.maxRad = 4.0;
        this.endHeight = -6.0;
        this.initHeight = -2.0;

        this.maxX = this.maxRad * Math.cos(this.angle);
        this.maxZ = this.maxRad * Math.sin(this.angle);

        this.dx = this.maxX / 5000;
        this.dz = this.maxZ / 5000;
        this.dy = (this.initHeight - this.endHeight) / 1000;



        this.x = this.maxX * Math.random();
        //this.y = this.initHeight - Math.random() * (this.initHeight - this.endHeight);
        this.y = this.initHeight;
        this.z = this.maxZ * Math.random();
    }

    move()
    {
        this.x += this.dx;
        this.y += this.dy
        this.z += this.dz;

        this.dx += (Math.random() * 2 - 1) / 20000
        this.dz += (Math.random() * 2 - 1) / 20000

        if (Math.sqrt(this.x * this.x + this.z * this.z) > this.maxRad)
        {
            this.x = 0.0;
            this.z = 0.0;
            this.y = this.initHeight;

            this.dx = this.maxX / 5000;
            this.dz = this.maxZ / 5000;
        }


    }
}

class FogSystem
{
    constructor(particlesCount = 5) {
        this.particlesCount = particlesCount;
        this.fogCoords = [];

        this.fogs = []
        for (let i = 0; i < this.particlesCount; ++i)
        {
            let fog = new FogParticle();
            this.fogs.push(fog)
            this.fogCoords.push(fog.x, fog.y, fog.z);
        }
    }

    move()
    {
        this.fogCoords = [];

        for (let i = 0; i < this.particlesCount; ++i)
        {
            this.fogs[i].move();

        }

        this.fogs.sort(function (a, b) {
            return b.z - a.z;
        })

        for (let i = 0; i < this.particlesCount; ++i)
        {
            this.fogCoords.push(this.fogs[i].x, this.fogs[i].y, this.fogs[i].z);
        }

    }
}

// ---------------------------  FOG SHADER PROGRAM ----------------------

let fogShaderProgram = initShaderProgram(gl, fogVsShader, fogFsShader);
gl.useProgram(fogShaderProgram);

initBuffer(gl, traceVertices, gl.ARRAY_BUFFER, Float32Array);

let a_FogPosition = enableVertexAttrib(
    fogShaderProgram,
    "a_Position",
    3, 0, 0);
gl.enableVertexAttribArray(a_FogPosition);

// --------------------------- FIREWORKS UNIFORMS ------------------------------

fogShaderProgram.samplerUniform = gl.getUniformLocation(fogShaderProgram, "u_texture");
gl.uniform1i(fogShaderProgram.samplerUniform, 0);



let u_mWorldFog = gl.getUniformLocation(fogShaderProgram, "u_mWorld");
let u_mViewFog = gl.getUniformLocation(fogShaderProgram, "u_mView");
let u_mProjFog = gl.getUniformLocation(fogShaderProgram, "u_mProj");

gl.uniformMatrix4fv(u_mWorldFog, false, worldMatrix);
gl.uniformMatrix4fv(u_mViewFog, false, viewMatrix);
gl.uniformMatrix4fv(u_mProjFog, false, projMatrix);


//
// ---------------------------  DRAW FOG  ---------------------------------------
//

let fogSystem = new FogSystem(1000);
function drawFog()
{

    initBuffer(gl, fogSystem.fogCoords , gl.ARRAY_BUFFER, Float32Array);

    a_FogPosition = enableVertexAttrib(
        fogShaderProgram,
        "a_Position",
        3, 0, 0);
    gl.enableVertexAttribArray(a_FogPosition);
    gl.useProgram(fogShaderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureSmoke);
    gl.drawArrays(gl.POINTS, 0, fogSystem.particlesCount);

    fogSystem.move();

}


//
//=============================== FIRE ==================================================
//

function normalize(vec)
{
    let magn = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2])
    vec[0] = vec[0] / magn;
    vec[1] = vec[1] / magn;
    vec[2] = vec[2] / magn;
}
class FireParticle
{
    constructor(initPosition) {
        this.destinationPoint = [initPosition[0], initPosition[1] + 3, initPosition[2]];

        this.x = Math.random() - 0.5 + initPosition[0];
        this.y = initPosition[1];
        this.z = Math.random() - 0.5 + initPosition[2];

        this.initPosition = initPosition;

        this.flatAngle = 2 * Math.PI * Math.random();
        this.angle = Math.PI * Math.random();

        this.vector = [-Math.cos(this.flatAngle) * Math.sin(this.angle), Math.cos(this.angle), Math.sin(this.angle) * Math.sin(this.flatAngle)]
        normalize(this.vector);
    }

    move()
    {
        let vecToDestination = [this.x - this.destinationPoint[0], this.y - this.destinationPoint[1], this.z - this.destinationPoint[2]];
        normalize(vecToDestination);


        let vecChange = [(this.vector[0] - vecToDestination[0]) / 15, (this.vector[1] - vecToDestination[1]) / 15, (this.vector[2] - vecToDestination[2]) / 15];

        this.vector[0] = this.vector[0] + vecChange[0];
        this.vector[1] = this.vector[1] + vecChange[1];
        this.vector[2] = this.vector[2] + vecChange[2];

        normalize(this.vector);

        this.x = this.x + this.vector[0] * 0.01;
        this.y = this.y + this.vector[1] * 0.01;
        this.z = this.z + this.vector[2] * 0.01;

        this.destinationPoint[0] = 2 * Math.random() - 1
        this.destinationPoint[3] = 2 * Math.random() - 1
        if (this.y > this.destinationPoint[1] + 0.1)
        {
            this.x = Math.random() - 0.5 + this.initPosition[0];
            this.y = this.initPosition[1];
            this.z = Math.random() - 0.5 + this.initPosition[2];

            this.flatAngle = 2 * Math.PI * Math.random();
            this.angle = Math.PI * Math.random();

            this.vector = [-Math.cos(this.flatAngle) * Math.sin(this.angle), Math.cos(this.angle), Math.sin(this.angle) * Math.sin(this.flatAngle)]
            normalize(this.vector);
        }
    }
}

class FireSystem
{
    constructor(particlesCount, initPosition) {
        this.particlesCount = particlesCount;

        this.speedToUpwards = 0.001;
        this.MaxY = 3.0;

        this.initPosition = initPosition;
        this.particles = []
        this.particlesCoords = []

        let p;
        for (let i = 0; i < this.particlesCount; ++i)
        {
            p = new FireParticle(this.initPosition);
            this.particles.push(p);
            this.particlesCoords.push(p.x, p.y, p.z);
        }
    }

    move()
    {
        this.particlesCoords = []
        for (let i = 0; i < this.particlesCount; ++i)
        {
            this.particles[i].move();
            this.particlesCoords.push(this.particles[i].x, this.particles[i].y, this.particles[i].z);
        }
    }

}


// ---------------------------  FIRE SHADER PROGRAM ----------------------

let fireShaderProgram = initShaderProgram(gl, fireVsShader, fireFsShader);
gl.useProgram(fireShaderProgram);

initBuffer(gl, null, gl.ARRAY_BUFFER, Float32Array);

let a_FirePosition = enableVertexAttrib(
    fogShaderProgram,
    "a_Position",
    3, 0, 0);
gl.enableVertexAttribArray(a_FirePosition);

// --------------------------- FIREWORKS UNIFORMS ------------------------------

let u_mWorldFire = gl.getUniformLocation(fireShaderProgram, "u_mWorld");
let u_mViewFire = gl.getUniformLocation(fireShaderProgram, "u_mView");
let u_mProjFire = gl.getUniformLocation(fireShaderProgram, "u_mProj");

gl.uniformMatrix4fv(u_mWorldFire, false, worldMatrix);
gl.uniformMatrix4fv(u_mViewFire, false, viewMatrix);
gl.uniformMatrix4fv(u_mProjFire, false, projMatrix);

let u_Color = gl.getUniformLocation(fireShaderProgram, "u_Color");
gl.uniform3fv(u_Color, [1.0, 0.0, 0.0]);

let u_initPosition = gl.getUniformLocation(fireShaderProgram, "u_initPosition");
gl.uniform3fv(u_initPosition, [0.0, 0.0, 0.0]);


//
// ---------------------------  DRAW FIRE  --------------------------------------
//

let fireSystem = new FireSystem(1000, [0.0, -1.0, 0.0]);

function drawFire()
{
    initBuffer(gl, fireSystem.particlesCoords , gl.ARRAY_BUFFER, Float32Array);

    a_FirePosition = enableVertexAttrib(
        fireShaderProgram,
        "a_Position",
        3, 0, 0);
    gl.enableVertexAttribArray(a_FirePosition);
    gl.useProgram(fireShaderProgram);

    gl.uniform3fv(u_initPosition, fireSystem.initPosition);
    fireSystem.move();
    gl.drawArrays(gl.POINTS, 0, fireSystem.particlesCount);
}




gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

let initTime = performance.now();
let loop = () =>

{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //drawSparks();
    //drawAllFireWorks(initTime);
    //drawFog()

    drawFire();

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

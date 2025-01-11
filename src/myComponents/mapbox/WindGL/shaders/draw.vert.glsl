// precision mediump float;

// attribute float a_index;

// uniform sampler2D u_particles;
// uniform float u_particles_res;

// varying vec2 v_particle_pos;

// void main() {
//     vec4 color = texture2D(u_particles, vec2(
//         fract(a_index / u_particles_res),
//         floor(a_index / u_particles_res) / u_particles_res));

//     // decode current particle position from the pixel's RGBA value
//     v_particle_pos = vec2(
//         color.r / 255.0 + color.b,
//         color.g / 255.0 + color.a);

//     gl_PointSize = 1.0;
//     gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);
// }


#define EPSILON 0.0000001
#define EXTENT 8192.0
#define PI 3.141592653589793
float TWICE_PI = PI * 2.0;
float HALF_PI = PI / 2.0;
float QUARTER_PI = PI / 4.0;
float RAD_TO_DEG = 180.0 / PI;
float DEG_TO_RAD = PI / 180.0;
float GLOBE_RADIUS = EXTENT / PI / 2.0;
float sinh(float f){
    return (exp(f)-exp(-f))/2.0;
}
float asinh(float f){
    return log(f+sqrt(pow(f,2.0)+1.0));
}
float mercatorXfromLng(float lng) {
    return (180.0 + lng) / 360.0;
}
float mercatorYfromLat(float lat) {
    return 0.5 - asinh(tan(lat * DEG_TO_RAD)) / TWICE_PI;
}
float lngFromMercatorX(float x) {
    return x * 360.0 - 180.0;
}
float latFromMercatorY(float y){
    return atan(sinh((0.5 - y) * TWICE_PI)) * RAD_TO_DEG;
}
vec3 latLngToECEF(vec2 latLng) {
    latLng = DEG_TO_RAD * latLng;
    float cosLat = cos(latLng[0]);
    float sinLat = sin(latLng[0]);
    float cosLng = cos(latLng[1]);
    float sinLng = sin(latLng[1]);
    // Convert lat & lng to spherical representation. Use zoom=0 as a reference
    float sx = cosLat * sinLng * GLOBE_RADIUS;
    float sy = -sinLat * GLOBE_RADIUS;
    float sz = cosLat * cosLng * GLOBE_RADIUS;
    return vec3(sx, sy, sz);
}
precision mediump float;
attribute float a_index;
uniform sampler2D u_particles;
uniform float u_particles_res;
uniform int projection;
varying vec2 uv_pos;
uniform mat4 u_matrix;  // update by limz
uniform vec4 u_boundaries;// boundaries
void main() {
    gl_PointSize = 3.0;
    vec4 color = texture2D(u_particles, vec2(fract(a_index / u_particles_res),floor(a_index / u_particles_res) / u_particles_res));
    // decode current particle position from the pixel's RGBA value
    uv_pos = vec2(color.r / 255.0 + color.b, color.g / 255.0 + color.a);
    mat3 m1 = mat3(
        1,0,uv_pos.x,
        0,1,uv_pos.y,
        0,0,1
    );
    /*真实流场位置,和micaps数据位置对应*/
    // float startLng = 32.0;
    // float stopLng = 160.0;
    // float startLat = 12.0;
    // float stopLat = 80.0;

    //真实风场数据，和重庆组网对应
    float startLng = u_boundaries[0];
    float stopLng = u_boundaries[1];
    float startLat = u_boundaries[2];
    float stopLat = u_boundaries[3];

    // float LAT = atan(sinh(PI))*RAD_TO_DEG;
    // float startLng = -180.0;
    // float stopLng = 180.0;
    // float startLat = -LAT;
    // float stopLat = LAT;

    vec2 pt1 = vec2(mercatorXfromLng(startLng),mercatorYfromLat(startLat));
    vec2 pt2 = vec2(mercatorXfromLng(stopLng),mercatorYfromLat(stopLat));

    mat3 m2 = mat3(
        pt2.x-pt1.x,0,pt1.x,
        0,pt1.y-pt2.y,pt2.y,
        0,0,1
    );
    mat3 m3 =  m1 * m2;
    if(projection == 0){
        gl_Position = u_matrix * vec4(m3[0][2],m3[1][2], 0.0, 1.0);
    }else{
        float lng = lngFromMercatorX(m3[0][2]);
        float lat = latFromMercatorY(m3[1][2]);
        vec3 v_particle_pos = latLngToECEF(vec2(lat,lng));
        gl_Position = u_matrix * vec4(v_particle_pos, 1.0);
    }
}
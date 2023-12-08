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

precision mediump float;
attribute float a_index;
uniform sampler2D u_particles;
uniform float u_particles_res;
varying vec2 v_particle_pos;
uniform mat4 u_matrix;  // update by limz
void main() {
    vec4 color = texture2D(u_particles, vec2(
        fract(a_index / u_particles_res),
        floor(a_index / u_particles_res) / u_particles_res));
    // decode current particle position from the pixel's RGBA value
    v_particle_pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a);
    gl_PointSize = 1.0;
    // update by limz   +1 and / 2  坐标从-1 到1 转 0 到1 
    // gl_Position = u_matrix * vec4((2.0 * v_particle_pos.x - 1.0 + 1.0) / 2.,  1.0 -  (1.0+1.0 - 2.0 * v_particle_pos.y) / 2.0, 0.0, 1);
    gl_Position = u_matrix * vec4(v_particle_pos.x, v_particle_pos.y, 0.0, 1);
}
const planetsData = [
    {
        nombre: 'Mercurio',
        diametro: '4,880 km',
        distancia_al_sol: '58 millones de kilómetros',
        duracion_ano: '88 días terrestres',
        duracion_dia: '176 días terrestres',
        temperatura_maxima: '430°C (800°F)',
        temperatura_minima: '-180°C (-290°F)',
        lunas: 0,
        atmosfera: 'No tiene atmósfera, solo una capa delgada de gases (exosfera)',
        edad: '4.5 mil millones de años',
        material_nucleo: 'Hierro (85% del radio del planeta)',
        textureUrl: 'textures/Mercury/mercurymap.jpg',
        radio_orbita: 12.0,
        tamaño: 0.45,
        velocidad_orbital: 0.0047,
        velocidad_rotacion: 0.004,
    },
    {
        nombre: 'Venus',
        diametro: '12,104 km',
        distancia_al_sol: '108 millones de kilómetros',
        duracion_ano: '225 días terrestres',
        duracion_dia: '243 días terrestres',
        temperatura_promedio: '475°C (900°F)',
        lunas: 0,
        atmosfera: 'Densa, compuesta de dióxido de carbono y nubes de ácido sulfúrico',
        textureUrl: 'textures/Venus/ven0aaa2.jpg',
        radio_orbita: 18.0,
        tamaño: 1.125,
        velocidad_orbital: 0.0035,
        velocidad_rotacion: 0.003,
    },
    {
        nombre: 'Tierra',
        diametro: '12,760 km',
        distancia_al_sol: '150 millones de kilómetros',
        duracion_ano: '365.25 días',
        duracion_dia: '23.9 horas',
        temperatura_promedio: 'Varía, pero el planeta es habitable.',
        lunas: 1,
        atmosfera: '78% nitrógeno, 21% oxígeno',
        textureUrl: 'textures/Earth/ear0xuu2.jpg',
        radio_orbita: 24.0,
        tamaño: 1.2,
        velocidad_orbital: 0.003,
        velocidad_rotacion: 0.002,
    },
    {
        nombre: 'Marte',
        diametro: '6,779 km',
        distancia_al_sol: '228 millones de kilómetros',
        duracion_ano: '687 días terrestres',
        duracion_dia: '24.6 horas',
        temperatura_promedio: '-60°C',
        lunas: 2,
        nombres_lunas: ['Fobos', 'Deimos'],
        atmosfera: 'Muy delgada, compuesta principalmente de dióxido de carbono',
        textureUrl: 'textures/Mars/2k_mars.jpg',
        radio_orbita: 30.0,
        tamaño: 0.6,
        velocidad_orbital: 0.0024,
        velocidad_rotacion: 0.018,
    },
    {
        nombre: 'Júpiter',
        diametro: '139,820 km',
        distancia_al_sol: '778 millones de kilómetros',
        duracion_ano: '12 años terrestres',
        duracion_dia: '10 horas',
        lunas: 95,
        nombres_lunas: ['Ío', 'Europa', 'Ganimedes', 'Calisto'],
        atmosfera: 'Compuesta principalmente de hidrógeno y helio',
        textureUrl: 'textures/Jupiter/jup0vss1.jpg',
        radio_orbita: 45.0,
        tamaño: 3.0,
        velocidad_orbital: 0.0013,
        velocidad_rotacion: 0.002,
    },
    {
        nombre: 'Saturno',
        diametro: '120,500 km',
        distancia_al_sol: '1.4 mil millones de kilómetros',
        duracion_ano: '29.4 años terrestres',
        duracion_dia: '10.7 horas',
        lunas: 146,
        atmosfera: 'Principalmente hidrógeno y helio',
        textureUrl: 'textures/Saturn/sat0fds1.jpg',
        radio_orbita: 67.5,
        tamaño: 2.7,
        velocidad_orbital: 0.00096,
        velocidad_rotacion: 0.0005,
    },
    {
        nombre: 'Urano',
        diametro: '51,118 km',
        distancia_al_sol: '2.9 mil millones de kilómetros',
        duracion_ano: '84 años terrestres',
        duracion_dia: '17 horas',
        lunas: 28,
        atmosfera: 'Principalmente hidrógeno, helio y metano',
        textureUrl: 'textures/Uranus/uranusmap.jpg',
        radio_orbita: 90.0,
        tamaño: 1.5,
        velocidad_orbital: 0.00068,
        velocidad_rotacion: 0.03,
    },
    {
        nombre: 'Neptuno',
        diametro: '49,528 km',
        distancia_al_sol: '4.5 mil millones de kilómetros',
        duracion_ano: '165 años terrestres',
        duracion_dia: '16 horas',
        lunas: 14,
        atmosfera: 'Compuesta de hidrógeno, helio y metano',
        textureUrl: 'textures/Neptune/neptunemap.jpg',
        radio_orbita: 112.5,
        tamaño: 1.425,
        velocidad_orbital: 0.00054,
        velocidad_rotacion: 0.029,
    },
    {
        nombre: 'Sol',
        diametro: '1.39 millones de kilómetros',
        distancia_a_la_tierra: '150 millones de kilómetros',
        temperatura_superficie: '5,500°C (10,000°F)',
        edad: '4.5 mil millones de años',
        duracion_luz: '8 minutos y 20 segundos',
        textureUrl: 'textures/Sun/2k_sun.jpg',
        radio_orbita: 0,
        tamaño: 6.0,
        velocidad_orbital: 0,
        velocidad_rotacion: 0,
    }
];

export default planetsData;

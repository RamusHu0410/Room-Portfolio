export const ROOM_HALF_X = 3.6;
export const ROOM_HALF_Z = 3.6;
export const WALK_MARGIN = 0.5;
export const EYE_HEIGHT = 1.5;
export const DESK_COLLISION_RADIUS = 1.0;

export const DOOR_POSITION = [0, 0, ROOM_HALF_Z - 0.05];
export const LIGHT_SWITCH_POSITION = [0.9, 1.15, ROOM_HALF_Z - 0.16];
// flush against the west wall, same clearance formula as the original layout
export const DESK_POSITION = [-ROOM_HALF_X + 0.6, 0, -0.5];
export const DESK_ROTATION_Y = Math.PI / 2;
export const SPAWN_POSITION = [0, 0, 1.7];

export const CHAIR_POSITION = [-ROOM_HALF_X + 1.45, 0, -0.5];
export const CHAIR_ROTATION_Y = -Math.PI / 2;
export const CHAIR_COLLISION_RADIUS = 0.55;

export const SIT_DISTANCE = 0.62;
export const SIT_FOV = 34;

export const WINDOW_POSITION = [1.0, 1.5, -ROOM_HALF_Z + 0.05];
export const WINDOW_SIZE = [1.6, 1.8];

export const AWARDS_BOARD_POSITION = [ROOM_HALF_X - 0.2, 1.5, 0.8];
export const AWARDS_BOARD_ROTATION_Y = -Math.PI / 2;

// local offset on the desk's tabletop, on the left of the laptop (viewer's left when seated)
export const RESUME_PAPER_POSITION = [-0.55, 0.756, 0.2];

export const PIANO_POSITION = [1.9, 0, 1.9];
// angled 30 degrees further from the wall, turning the piano toward the window
export const PIANO_ROTATION_Y = -Math.PI / 2 - Math.PI / 6;
export const PIANO_COLLISION_RADIUS = 1.3;

export const PERFORMANCE_VIDEO_ID = '3vIi7mJCrao';

export const PROJECTS = [
  {
    id: 'hu-accompany',
    title: 'Hu Accompany',
    tech: ['Python', 'Dart', 'C++'],
    link: 'https://github.com/RamusHu0410/hu-accompany',
    color: '#38bdf8'
  }
];

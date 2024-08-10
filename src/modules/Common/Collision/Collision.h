#pragma once

#include <SDL.h>
#include <memory>

using std::unique_ptr;
using std::make_unique;

struct CollisionParams;

class Collision {
    public:
        class CollisionImpl;
        unique_ptr<CollisionImpl> collisionImpl;

        Collision(CollisionParams*);

        bool doesItContains(SDL_Rect*, int, int);
};

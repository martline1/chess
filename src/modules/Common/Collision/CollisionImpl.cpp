#pragma once

#include "Collision.h"

#include "../Config/Config.h"
#include "../../App/App.h"

struct CollisionParams {
    App* app;
    Config* config;
};

class Collision::CollisionImpl {
    private:
        App* app;
        Config* config;

    public:
        CollisionImpl(CollisionParams* params):
            app(params->app),
            config(params->config)
        {}

        App* getApp() {
            return this->app;
        }

        Config* getConfig() {
            return this->config;
        }
};

Collision::Collision(CollisionParams* params):
    collisionImpl(make_unique<CollisionImpl>(params))
{}

bool Collision::doesItContains(SDL_Rect* source, int globalX, int globalY) {
    Config* config = this->collisionImpl->getConfig();

    int windowX, windowY, side = config->getSide();

    SDL_GetWindowPosition(this->collisionImpl->getApp()->getWindow(), &windowX, &windowY);

    // Out of bound
    if (globalX > (windowX + side) || globalY > (windowY + side)) return false;

    int originalX = source->x;
    int originalY = source->y;

    int translatedX = globalX - windowX;
    int translatedY = globalY - windowY;

    int largerX = originalX + source->w;
    int largerY = originalY + source->h;

    bool intersectsX = translatedX > originalX && translatedX < largerX;
    bool intersectsY = translatedY > originalY && translatedY < largerY;

    return intersectsX && intersectsY;
}

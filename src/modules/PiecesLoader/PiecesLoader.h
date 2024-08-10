#pragma once

#include <SDL.h>
#include <SDL2_image/SDL_image.h>

#include <map>
#include <cmath>
#include <memory>
#include <vector>
#include <functional>

using std::map;
using std::move;
using std::vector;
using std::function;
using std::unique_ptr;
using std::make_unique;

class PiecesLoader {
    private:
        SDL_Surface* image;
        SDL_Texture* texture;
        bool loadTextureCalled;

    public:
        class PiecesLoaderImpl;
        unique_ptr<PiecesLoaderImpl> piecesLoaderImpl;

        PiecesLoader();

        void loadPieces();
        void loadTexture();
        SDL_Surface* getImage();

        ~PiecesLoader();
};

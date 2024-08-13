#pragma once

#include <string>
#include <memory>
#include <vector>
#include <functional>

using std::string;
using std::vector;
using std::function;
using std::unique_ptr;
using std::make_unique;

struct PieceParams;

template<class T>
class Piece {
    private:
        int alpha;
        function<void(int, int)> renderTexture;

    public:
        class PieceImpl;
        unique_ptr<PieceImpl> pieceImpl;

        Piece(PieceParams*);

        void render();
        void onPointerDown(int, int);
        bool isBeingHovered(int, int);
        void updatePosition();

        virtual void updatePosition(T*);
        virtual void onMoveEnd(int, int);
        virtual vector<T> getPossibleMoves() = 0;

        virtual ~Piece() = default;
};

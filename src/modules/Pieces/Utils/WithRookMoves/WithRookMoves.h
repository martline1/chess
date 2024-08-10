#pragma once

#include <memory>

using std::unique_ptr;
using std::make_unique;

class WithRookMoves {
    public:
        class WithRookMovesImpl;
        unique_ptr<WithRookMovesImpl> withRookMovesImpl;

        WithRookMoves();
};

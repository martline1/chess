#pragma once

#include "InstanceOf.h"

template<typename Base, typename T>
bool InstanceOf::check(const T *ptr) {
    return dynamic_cast<const Base*>(ptr) != nullptr;
}

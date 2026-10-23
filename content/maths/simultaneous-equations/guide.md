## Linear simultaneous equations

Two equations, two unknowns — the solution is the $(x,y)$ pair that satisfies **both** at once.

### Method: elimination

Make the coefficient of one variable match in both equations (by multiplying), then add or subtract to remove it.

$$3x + 2y = 16$$
$$5x - 2y = 8$$

The $y$ coefficients are already matched (2 and −2) — **add** the equations to eliminate $y$:

$$8x = 24 \implies x = 3$$

Substitute back into either original equation: $3(3) + 2y = 16 \implies 2y = 7 \implies y = 3.5$.

**Check your answer** in the *other* equation: $5(3) - 2(3.5) = 15 - 7 = 8$ ✓.

> **Exam tip:** Always check your solution in the equation you *didn't* substitute into — it catches arithmetic slips before you lose marks.

### Method: substitution

Rearrange one equation to make a variable the subject, then substitute it into the other.

$$y = 2x + 1$$
$$3x + y = 11$$

Substitute $y$: $3x + (2x+1) = 11 \implies 5x = 10 \implies x = 2$, so $y = 2(2)+1 = 5$.

## Simultaneous equations with a quadratic (Higher tier)

When one equation is linear and the other is quadratic (e.g. a line and a circle, or a line and a curve), **substitution is the only method that works** — you can't eliminate here.

$$y = x + 1$$
$$x^2 + y^2 = 13$$

Substitute $y = x+1$ into the second equation:

$$x^2 + (x+1)^2 = 13$$
$$x^2 + x^2 + 2x + 1 = 13$$
$$2x^2 + 2x - 12 = 0$$
$$x^2 + x - 6 = 0$$
$$(x+3)(x-2) = 0 \implies x = -3 \text{ or } x = 2$$

This gives **two pairs of solutions** — find the matching $y$ for each $x$:
- $x=-3 \implies y = -2$
- $x=2 \implies y = 3$

> **Exam tip:** A linear/quadratic pair almost always gives **two** solutions (unless the line is a tangent, giving one repeated solution) — if you only find one pair, go back and check your quadratic step.

## Graphically

Each equation is a graph; the solution(s) are where the graphs **intersect**. A linear/quadratic pair geometrically means: where does a straight line cross a curve? That's exactly why there can be 0, 1 or 2 solutions, depending on whether the line misses, touches, or crosses the curve.

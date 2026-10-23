## What counts as a quadratic

Any equation that can be written $ax^2 + bx + c = 0$ (with $a \neq 0$). There are three main methods for solving one — know when to reach for each.

## Method 1: factorising

Fastest when it works cleanly. Find two numbers that **multiply to give $c$** and **add to give $b$**.

$$x^2 + 5x + 6 = 0$$

Two numbers that multiply to 6 and add to 5: **2 and 3**.

$$(x+2)(x+3) = 0 \implies x = -2 \text{ or } x = -3$$

> **Exam tip:** Always check your factorised brackets by expanding them back out mentally — it catches sign errors before they cost you the answer.

## Method 2: the quadratic formula

**Given on the AQA formula sheet** — you don't need to memorise it, but you do need to know how to use it correctly:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Use this whenever factorising isn't obvious (ugly numbers, or the equation doesn't factorise nicely).

**Example:** solve $2x^2 + 3x - 5 = 0$ ($a=2, b=3, c=-5$):

$$x = \frac{-3 \pm \sqrt{3^2 - 4(2)(-5)}}{2(2)} = \frac{-3 \pm \sqrt{9+40}}{4} = \frac{-3 \pm 7}{4}$$

$$x = 1 \text{ or } x = -2.5$$

> **Exam tip:** Work out $b^2-4ac$ (the **discriminant**) separately first, before putting it into the rest of the formula — it's the step where sign errors happen most, and isolating it makes mistakes easier to spot.

## The discriminant tells you how many solutions there are

Without fully solving, $b^2 - 4ac$ tells you:
- **Positive** → two different real solutions
- **Zero** → exactly one solution (a repeated root — the graph just touches the x-axis)
- **Negative** → no real solutions (the graph doesn't cross the x-axis at all)

## Method 3: completing the square

Rewrites $x^2+bx+c$ as $(x+p)^2+q$, which is especially useful for finding a quadratic graph's **turning point** (minimum/maximum).

$$x^2 + 6x + 5 = (x+3)^2 - 9 + 5 = (x+3)^2 - 4$$

(Halve the $b$ coefficient for $p$; then $q = c - p^2$.)

From this form, the minimum point is at $(-3, -4)$ — directly readable once it's in this form.

> **Exam tip:** "Solve by completing the square" still gives you the solutions — set $(x+p)^2+q=0$ and rearrange, same idea as the other methods, just a different starting point.

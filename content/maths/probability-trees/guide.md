## Combining probabilities

Two rules, both **given on the AQA formula sheet**:

$$P(A \text{ and } B) = P(A) \times P(B \mid A)$$
$$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$$

($P(B \mid A)$ means "the probability of $B$, given $A$ has happened" — for independent events this is just $P(B)$.)

- **"And"** (both things happen) → **multiply**.
- **"Or"** (at least one happens) → **add**, then subtract the overlap (so you don't double-count outcomes where both happen).

## Independent vs. dependent events

- **Independent**: one event doesn't affect the probability of the other (e.g. rolling a die twice; picking an item **with** replacement).
- **Dependent**: one event changes the probability of the next (e.g. picking two items from a bag **without** replacement — there's one fewer item, and possibly one fewer of a certain colour, for the second pick).

> **Exam tip:** "With replacement" or "without replacement" in a question is telling you directly whether the events are independent or dependent — it changes the second branch's probabilities on a tree diagram.

## Probability trees

Each branch shows a probability; multiply **along** a branch (for "and"), add **between** branches (for "or" — different complete paths that reach the outcome you want).

**Example (without replacement):** a bag has 3 red and 2 blue balls. Two balls are picked without replacement. Find the probability both are red.

- First pick: $P(\text{red}) = \dfrac{3}{5}$
- Second pick (given the first was red, one red ball is now gone): $P(\text{red}) = \dfrac{2}{4} = \dfrac{1}{2}$

$$P(\text{both red}) = \frac{3}{5} \times \frac{1}{2} = \frac{3}{10}$$

**Example (find "at least one"):** using the same bag, find the probability of **at least one** red ball in two picks.

The easiest approach is usually the complement: $P(\text{at least one red}) = 1 - P(\text{no red})$.

$$P(\text{no red}) = P(\text{blue, blue}) = \frac{2}{5} \times \frac{1}{4} = \frac{2}{20} = \frac{1}{10}$$
$$P(\text{at least one red}) = 1 - \frac{1}{10} = \frac{9}{10}$$

> **Exam tip:** Whenever you see "at least one," check whether $1 - P(\text{none})$ is quicker than adding up every other possible outcome — it almost always is.

## Reading a tree diagram correctly

- The probabilities on branches from the **same point** always add up to 1.
- To find the probability of one specific full outcome (e.g. "red then blue"), **multiply along that path**.
- To find the probability of an outcome that can happen in more than one way (e.g. "exactly one red"), find **each path** that gives that outcome, multiply along each, then **add the paths together**.

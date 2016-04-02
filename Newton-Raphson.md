<script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>

Example of a Lisp macro to implement Newton-Raphson algorithm.
======

We introduce the Simplex algorithm, and the Newton-Raphson algorithm,
along with their implementations in Python and Clojure.

Let's approximate $\sqrt{2}$!
---------

So let's set ourselves to calculate $\sqrt{2}$. It is defined as the
positive solution of $x^2=2$. Since the function $f:x\mapsto x^2$ is
strictly increasing over $\mathbb{R}^+$, the equation $f(x)=2,x\geq 0$
has only one solution, and since $f(1)=1<2$ and $f(2)=4>2$, we know
that this solution is between $1$ and $2$. We now calculate
$f(1.5)=2.25>2$, so we have $1<\sqrt{2}<1.5$. We get a better
approximation by calculating $f(\frac{1+1.5}{2})=f(1.25)=1.5625<2$ so
we know that $1.25<\sqrt{2}<1.5$. We could carry on like that forever,
but it will be faster to write a quick function to do that for us.
Let's do it in Python:


    def approx_sqrt_two(tol=0.00001,n_max=100):
        a,b = 1.0,2.0
        error = (b-a)/2
        n = 1
        while error > tol and n < n_max:
            candidate = (a+b)/2
            candidate_value = candidate**2
            if candidate_value > 2:
                b = candidate
            else:
                a = candidate
            n += 1
            error = (b-a)/2
        return candidate

A more generalized method
-----

The above code works well, but it can't be used to calculate any other
things that $\sqrt{2}$. The first thing we can do is tweak it so it
can calculate the square root of any number:

    def approx_sqrt(target,tol=0.00001,n_max=100):
        a,b = 1.0,target
        error = (b-a)/2
        n = 1
        while error > tol and n < n_max:
            candidate = (a+b)/2
            candidate_value = candidate**2
            if candidate_value > target:
                b = candidate
            else:
                a = candidate
            n += 1
            error = (b-a)/2
        return candidate

So there it is, our new function `approx_sqrt` can calculate the
square root of any number. In fact we can do even better by enabling
our algorithm to be used for an arbitrary function.

What we want is to have a function with a signature `def
approx(func,target,tol=00001,n_max=100)` where `func` will be a lambda
expression. Here is a first try:

    def approx(func,target,a=0,b=100,tol=0.00001,n_max=100):
        error = (b-a)/2
        n = 1
        while error > tol:
            candidate = (a+b)/2
            candidate_value = func(candidate)
            if candidate_value > target:
                b = candidate
            else:
                a = candidate
            n += 1
            error = (b-a)/2
        return candidate


We now need to specify the bounds inside which the solution resides
(the arguments `a` and `b`), and also it assumes that `func` is
increasing (at the line `if candidate_value > target:`). If we assume
`func` is monotonic (either always increasing or always decreasing) we
can make a small modification to that code where we guess whether
`func` is increasing or decreasing, by calculating the rate
$\displaystyle\frac{\text{func}(b)-\text{func}(a)}{b-a}$:

    def approx2(func,target,a=0,b=100,tol=0.00001,n_max=100):
        rate = (func(b)-func(a))/(b-a)
        compare = (lambda x,y: x > y) if rate > 0 else (lambda x,y: x < y)
        error = (b-a)/2
        n = 1
        while error > tol:
            candidate = (a+b)/2
            candidate_value = func(candidate)
            if compare(candidate_value, target):
                b = candidate
            else:
                a = candidate
            n += 1
            error = (b-a)/2
        return candidate


A faster algorithm: Newton-Raphson
---

Let us go back to the first problem and see how fast the first
algorithm performs to calculate $\sqrt{2}$. Is that algorithm
efficient? We make a small change in the first version of the code to
return how many iterations it required:



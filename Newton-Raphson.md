

<script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  tex2jax: {inlineMath: [['$','$'], ['\$','\$']]}
});
</script>
Example of a Lisp macro to implement Newton-Raphson algorithm.
======

We introduce the bisection algorithm, and the Newton-Raphson algorithm,
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


Can we do better? When searching for a better candidate that `a` and
`b`, the bisection algorithm takes the value
$\displaystyle\frac{a+b}{2}$. Taking the average is a reasonable
choice but it can seem a bit arbitrary, and that is where lies any
improvement of that algorithm. The algorithm of Newton-Raphson does
just that: it starts with $a$ as a first candidate, and then the
second candidate is calculated by solving:
$f'(a)(x-a)+f(a)=\text{target}$.

Why this formula? $y=f'(a)(x-a)+f(a)$ is the equation of the tangent
in $a$ of the curve defined by $y=f(x)$. Look for a graphical
explanation.

Here is the code for it:

    def approx_sqrt_two_nr(tol=0.00001,n_max=100):
        a,b = 1.0,2.0
        n = 1
        candidate = a
        error = abs(candidate**2-2)
        while error > tol and n < n_max:
            candidate = (2-candidate**2)/(2.0*candidate) + candidate
            candidate_value = candidate**2
            n += 1
            error = abs(candidate**2-2)
        return candidate,n

[insert graphic here]

The question that remains is: can we change the code to make it take
a lambda argument like we did with the bisection algorithm?

Generalizing the Newton-Raphson code for any function
----

Let us look as what it would take: the Newton-Raphson algorithm
requires to calculate the derivative of $f$, the function we want to
invert, which means taking a function (in our case: `x**2`) and
applying it a non trivial transformation (in our case it becomes`2*x`).

It is possible in any language to have a program that calculates
symbolic derivatives. What is harder is to have this integrated with
the rest of the code. Here is some pseudo code to implement
Newton-Raphson in python with the function to solve as an input:

    def approx_nr(func,target,candidate=0,tol=0.001,n_max=100):
        error = abs(func(candidate)-target)
        n = 1
        derivative_func = derivative(func) #this is the hard part
        while error > tol and n < n_max:
            candidate = (target-func(candidate))/derivative_func(candidate) + candidate
            candidate_value = func(candidate)
            n += 1
            error = abs(candidate_value-target)
        return candidate,n

The problem lies in the command `derivative(func)`, which is supposed
to calculate the derivative of func. It is possible to do it with the
numerical derivative, which consists at approximating the quantity
$f'(x)$ with $f'(x) ~
\displaystyle\frac{f(x+\varepsilon)-f(x-\varepsilon)}{2\varepsilon}$
but I want to ignore this possibility as the goal of this article is
to introduce a Lisp macro through symbolic derivative.
    
An attempt to do it in Python
----

To calculate the symbolic derivative of a function, we need to have
first its expression, which isn't available with a lambda expression.
So we need to introduce a `Function` object that will contain that:

    class Function:

        def __init__(self,expression,evaluation):
            self.expression = expression
            self.evaluation = evaluation

###Representing a synctactic tree

The question arises: how to store the function's expression? The
simplest answer, as a string (so `x**2` would simply become `"x**2"`)
turns out to be inconvenient to calculate the derivative. Instead it
is much better to store the expression as a direct representation of
the function syntactic tree: 

       "**"
     /      \ 
   "x"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2

This representation shows that the main function is `"**"` and its two
arguments are `"x"` and `2`. One way to represent this
programmatically is to create a class like:

    class NodeFunction:

        def __init__(self,main,arguments):
            self.main = main
            self.arguments = arguments


And our expression would become `NodeFunction("**",["x",2])`. If we
want to represent `(x+1)**2` the same way, it would become:
`NodeFunction("**",[NodeFunction("+",["x",1]),2])`.

Another way is to represent our syntactic tree is through a list:
`"x**2"` becomes `["**","x",2]`, and `"(x+1)**2"` becomes
`["**",["+","x",1],2]`.

Those two ways are equivalent but I will use the latter as it is more
succinct, so I will stick with it for the rest.

###Symbolic derivative

Let's calculate the derivative of a function! Before that, here is a
reminder of the rules to calculate the derivative:

$\frac{d(f+g)}{dx} = \frac{df}{dx}+\frac{dg}{dx}$

$\frac{d(f-g)}{dx} = \frac{df}{dx} - \frac{dg}{dx}$

$\frac{d(fg)}{dx} = \frac{df}{dx}g + f\frac{dg}{dx}$

$\frac{d(f/g)}{dx} = \frac{\frac{df}{dx}g-f\frac{dg}{dx}}{\big(\frac{dg}{dx}\big)^2}$

$\frac{d(f(g))}{dx} = \frac{dg}{dx}\Big(\frac{df}{dx}\Big)(g)$

And the derivatives of elementary functions:

$\frac{dx}{dx} = 1$

$\frac{dK}{dx} = 0$ &nbsp;&nbsp;&nbsp; If $K$ is a constant (with respect to $x$).

$\frac{dx^n}{dx} = nx^{n-1}$

$\frac{d(\cos x)}{dx} = -\sin x$

$\frac{d(\sin x)}{dx} = \cos x$

$\frac{de^x}{dx} = e^x$

$\frac{d\ln x}{dx} = \frac{1}{x}$

Let's now write a function that calculates the symbolic derivative of
a mathematical expression. We will restrict ourselves to the functions
listed above.

The our function will take a mathematical expression as an argument,
along with the variable we are calculative the derivative with respect
to. So the signature of our function will be
`derivative(expr,variable)`.

The code will check if the expression is a constant or a variable, in
which case calculating the derivative is straightforward (it's $1$ if
the expression is equal to the variable, and $0$ otherwise), or if the
expression is more complex (then it will be expressed as a list). In
which case the code will break down the expression into the main
function (the first element of the list) and its arguments (the rest
of the list). So the start of the function will look like:

    def derivative(expr,variable):
        if type(expr) is not list:
            return 1 if expr == variable else 0
        main, args = expr[0],expr[1:]
        ...

Then we will check what is the value of `main` and apply the
corresponding formula to the arguments. For example, if `main` is
`"+"`, it will look like:

    derivative_args = map(lambda x:derivative(x,variable),args)
    return ["+"]+derivative_args

So the whole function is:

    def derivative(expr,variable):
        if type(expr) is not list:
            return 1 if expr == variable else 0
        main, args = expr[0], expr[1:]
        if main == "+":
            derivative_args = map(lambda x:derivative(x,variable),args)
            return ["+"]+derivative_args
        if main == "*":
            u,v = args[0],args[1] #assume there are only two arguments
            du, dv = derivative(u,variable), derivative(v, variable)
            return ["+",["*",du,v],[u,dv]]
        if main == "/":
            u,v = args[0],args[1] #assume there are only two arguments
            du, dv = derivative(u,variable), derivative(v, variable)
            return ["/",["-",["*",du,v],["*",u,dv]],["**",v,2]]
        if main == "**":
            u,v = args[0],args[1] #assume there are only two arguments
            du, dv = derivative(u,variable), derivative(v, variable)
            return ["*",["+",dv,["/",du,u]],["**",u,v]]
        if main == "exp": #exponential function
            u = arg[0] #assume one argument only
            du = derivative(u,variable)
            return ["*",du,["exp",u]]
        if main == "ln":
            u = arg[0] #assume one argument only
            du = derivative(u,variable)
            return ["/",du,u]
        if main == "cos":
            u = arg[0] #assume one argument only
            du = derivative(u,variable)
            return ["*",du,["*",-1,["sin",u]]]
        if main == "sin":
            u = arg[0] #assume one argument only
            du = derivative(u,variable)
            return ["*",du,["cos",u]]
        return None

This code is not the most robust and has some defaults (for example,
the multiplication can only take two arguments) but it is simple and
illustrates how symbolic derivatives are calculated.

We also need to be able to evaluate a syntactic tree at a given point.
The code will be very similar to the `derivative` function above: the
signature of the function will be `evaluate_tree(tree,values)` where
`values` is going to be a dictionary (to allow multiple variables).
For example `evaluate_tree(["+",1,"x"],{"x":2})` should read
`["+",1,"x"]`, replace `"x"` by `2` when it encounters it, and proceed
the evaluation recursively.

The code will be:

    def evaluate_tree(tree,values):
        if type(tree) is not list:
            if type(tree) is str:
                return values[tree]
            else: #in that case we assume that tree is a number
                return tree
        main, args = tree[0], tree[1:]
        args_evaluated = map(lambda x: evaluate_tree(x,values),args)
        if main == "+":
            return sum(args_evaluated)
        if main == "-":
            return args_evaluated[0] - sum(args_evaluated[1:])
        if main == "*":
            #again,assuming only two arguments
            return args_evaluated[0]*args_evaluated[1]
        if main == "/":
            return args_evaluated[0]/args_evaluated[1]
        if main == "**":
            return args_evaluated[0]**args_evaluated[1]
        #for the rest of the function, we assume only one argument
        #the functions log, exp, cos and sin need to be imported
        #from the math module
        if main == "ln":
            return log(args_evaluated[0])
        if main == "exp":
            return log(args_evaluated[0])
        if main == "cos":
            return cos(args_evaluated[0])
        if main == "sin":
            return sin(args_evaluated[0])
        return None

Again, not the most robust code, but it will fit for illustrative purpose.

###Complete implementation of Newton-Raphson

What remains is now to integrate the `derivative` function with the
rest of the code. It requires a small modification of the prototype
code we wrote in a previous paragraph (func is gonna be a `Function`
object that was described above):

    def approx_nr(func,target,candidate=0,tol=0.001,n_max=100):
        error = abs(func(candidate)-target)
        n = 1
        derivative_func = derivative(func.expression)
        while error > tol and n < n_max:
            candidate = (target-func(candidate))/evaluate_tree(derivative_func,{"x":candidate}) + candidate
            candidate_value = func(candidate)
            n += 1
            error = abs(candidate_value-target)
        return candidate,n



A Lisp version with a macro
----


###Brief description of the Lisp syntax



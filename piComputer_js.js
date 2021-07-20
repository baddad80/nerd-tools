/*
*   Adaption of https://bellard.org/pi/pi1.c
*   https://bellard.org/pi/pi_n2/pi_n2.html
*   https://bellard.org/pi/
*/


/*
 * Computation of the n'th decimal digit of pi with very little memory.
 * Written by Fabrice Bellard on February 26, 1997.
 * 
 * We use a slightly modified version of the method described by Simon
 * Plouffe in "On the Computation of the n'th decimal digit of various
 * transcendental numbers" (November 1996). We have modified the algorithm
 * to get a running time of O(n^2) instead of O(n^3log(n)^3).
 *
 * This program uses a variation of the formula found by Gosper in 1974 :
 * 
 * pi = sum( (25*n-3)/(binomial(3*n,n)*2^(n-1)), n=0..infinity);
 *
 * This program uses mostly integer arithmetic. It may be slow on some
 * hardwares where integer multiplications and divisons must be done by
 * software. We have supposed that 'int' has a size of at least 32 bits. If
 * your compiler supports 'long long' integers of 64 bits, you may use the
 * integer version of 'mul_mod' (see HAS_LONG_LONG).  
 */


function sleep(milliseconds) 
{
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) 
  {
    if ((new Date().getTime() - start) > milliseconds)
    {
      break;
    }
  }
}


/*await awaitSleep(3000); 
 can only be called in async function*/
function awaitSleep(milliseconds) 
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


function fmod (a,m)
{
    return ( a % m );
}


function mul_mod(a,b,m)
{ 
    return ( ( a * b ) % m);
}


function inv_mod( x,  y)
{
   let q, u, v, a, c, t;

   u = x;
   v = y;
   c = 1;
   a = 0;
   do {
      q = Math.floor(v / u);

      t = c;
      c = a - q * c;
      a = t;

      t = u;
      u = v - q * u;
      v = t;
   } while (u != 0);
   a = a % y;
   if (a < 0)
      a = y + a;
   return a;
}


/* return (a^b) mod m */
function pow_mod( a, b, m)
{
   let r, aa;

   r = 1;
   aa = a;
   while (1) 
   {
      if (b & 1)
      {
         r = mul_mod(r, aa, m);
      }
      b = b >> 1;
      if (b == 0)
      {
         break;
      }
      aa = mul_mod(aa, aa, m);
   }
   return r;
}

/* return true if n is prime */
function is_prime(n)
{
   let r, i;
   if ((n % 2) == 0)
   {
      return false;
   }

   r = Math.floor(Math.sqrt(n));
   for (i = 3; i <= r; i += 2)
   {
      if ((n % i) == 0)
      {
         return false;
      }
    }
   return true;
}


/* return the prime number immediatly after n */
function next_prime(n)
{
   do {
      n++;
   } while (!is_prime(n));
   return n;
}


var calculationCanceled = false;


function cancelComputeDigitValueCalcualtion()
{
   calculationCanceled = true;   // untested!
}


function computeDigitValue( p_Digit, progressCallback )
{
   let av, a, vmax, N, n, num, den, k, kq, kq2, t, v, s, i, sum;

   n = Number(p_Digit);

   N = Math.floor((n + 20) * Math.log(10) / Math.log(2));

   sum = 0;

   for (a = 3; a <= (2 * N) && !calculationCanceled; a = next_prime(a))
   {
      vmax = Math.floor(Math.log(2 * N) / Math.log(a));
      av = 1;
      for (i = 0; i < vmax; i++)
         av = av * a;

      s = 0;
      num = 1;
      den = 1;
      v = 0;
      kq = 1;
      kq2 = 1;

      for (k = 1; k <= N && !calculationCanceled; k++)
      {

         t = k;
         if (kq >= a)
         {
            do {
               t = t / a;
               v--;
            } while ((t % a) == 0);
            kq = 0;
         }
         kq++;
         num = mul_mod(num, t, av);

         t = (2 * k - 1);
         if (kq2 >= a)
         {
            if (kq2 == a)
            {
               do {
                  t = t / a;
                  v++;
               } while ((t % a) == 0);
            }
            kq2 -= a;
         }
         den = mul_mod(den, t, av);
         kq2 += 2;

         if (v > 0)
         {
            t = inv_mod(den, av);
            t = mul_mod(t, num, av);
            t = mul_mod(t, k, av);
            for (i = v; i < vmax; i++)
               t = mul_mod(t, a, av);
            s += t;
            if (s >= av)
               s -= av;
         }

      }

      t = pow_mod(10, n - 1, av);
      s = mul_mod(s, t, av);
      sum = fmod(sum +  s / av, 1.0);

      progressCallback( a, 2*N );
   }

   return Math.floor(sum*10);
}


def fizzBuzzWhizz(a,b,c)
  (1..100).each{|x| puts((x.to_s.include?(a.to_s) ? "Fizz":false) || ((x%a!=0&&x%b!=0&&x%c!=0) ? x : false)||((x%a==0 ? "Fizz":"") + (x%b==0 ? "Buzz":"") + (x%c==0 ? "Whizz":"")))}
end
fizzBuzzWhizz(3,5,7)
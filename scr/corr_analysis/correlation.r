data = read.csv("C:\\Users\\liu.6544\\Documents\\GitHub\\CoronavirusTransit\\data\\actual_ridership\\correlation.csv")
wfh_pop_rate = data$Work.from.home.populuation.ratio
all_working_pop = data$All.working.population
transit_pop_rate = data$Transit.commuting.population.ratio
google_trend = data$X..Unique.users
social_rate = data$social_rate
net_post_per_capita = data$net_post_per_capita
B = data$B
pop = data$pop
pp55 = data$pp55
pp65 = data$pp65
pp75 = data$pp75
pp85 = data$pp85

fit <- lm(B ~ Work.from.home.populuation.ratio + pp55 + black_ratio, data=data)
summary(fit)  # show results

car::vif(fit)
cor.test(data$Work.from.home.populuation.ratio, data$female_ratio)
cor.test(data$Work.from.home.populuation.ratio, data$hispanic_ratio)

residual = resid(fit)

par(mfrow=c(2,2))
plot(fit)

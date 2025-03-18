import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Timer from "@/pages/Timer";
import LogWorkout from "@/pages/LogWorkout";
import Progress from "@/pages/Progress";
import History from "@/pages/History";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Timer} />
      <Route path="/log" component={LogWorkout} />
      <Route path="/progress" component={Progress} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

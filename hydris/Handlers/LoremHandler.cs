using Hydris.Container;
using Hydris.Http;
using Hydris.Routing;

namespace Hydris.Bench.Handlers;

[Handler]
public sealed class LoremHandler {
    [Get("/lorem-1k")]
    public Reply Lorem1k() => Reply.View("Views/Pages/LoremApp1k").NoCache();

    [Get("/lorem-10k")]
    public Reply Lorem10k() => Reply.View("Views/Pages/LoremApp10k").NoCache();

    [Get("/lorem-nested-1k")]
    public Reply LoremNested1k() => Reply.View("Views/Pages/LoremNested1k").NoCache();

    [Get("/lorem-nested-10k")]
    public Reply LoremNested10k() => Reply.View("Views/Pages/LoremNested10k").NoCache();

    [Get("/lorem-styled-1k")]
    public Reply LoremStyled1k() => Reply.View("Views/Pages/LoremStyled1k").NoCache();

    [Get("/lorem-styled-10k")]
    public Reply LoremStyled10k() => Reply.View("Views/Pages/LoremStyled10k").NoCache();
}

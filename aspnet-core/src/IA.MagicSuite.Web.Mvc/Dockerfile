#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["src/IA.MagicSuite.Web.Mvc/IA.MagicSuite.Web.Mvc.csproj", "src/IA.MagicSuite.Web.Mvc/"]
COPY ["src/IA.MagicSuite.Web.Core/IA.MagicSuite.Web.Core.csproj", "src/IA.MagicSuite.Web.Core/"]
COPY ["src/IA.MagicSuite.Application/IA.MagicSuite.Application.csproj", "src/IA.MagicSuite.Application/"]
COPY ["src/IA.MagicSuite.Application.Shared/IA.MagicSuite.Application.Shared.csproj", "src/IA.MagicSuite.Application.Shared/"]
COPY ["src/IA.MagicSuite.Core.Shared/IA.MagicSuite.Core.Shared.csproj", "src/IA.MagicSuite.Core.Shared/"]
COPY ["src/IA.MagicSuite.Core/IA.MagicSuite.Core.csproj", "src/IA.MagicSuite.Core/"]
COPY ["src/IA.MagicSuite.EntityFrameworkCore/IA.MagicSuite.EntityFrameworkCore.csproj", "src/IA.MagicSuite.EntityFrameworkCore/"]
COPY ["src/IA.MagicSuite.GraphQL/IA.MagicSuite.GraphQL.csproj", "src/IA.MagicSuite.GraphQL/"]
RUN dotnet restore "src/IA.MagicSuite.Web.Mvc/IA.MagicSuite.Web.Mvc.csproj"
COPY . .
WORKDIR "/src/src/IA.MagicSuite.Web.Mvc"
RUN dotnet build "IA.MagicSuite.Web.Mvc.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IA.MagicSuite.Web.Mvc.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IA.MagicSuite.Web.Mvc.dll"]

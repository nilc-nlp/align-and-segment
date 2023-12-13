from typing import Literal
from pydantic import BaseModel, SecretStr, RedisDsn
from pydantic_settings import BaseSettings
from pathlib import Path


class RedisConfig(BaseModel):
    """
    This class sets up the Redis configuration.
    """

    host: str = "task_queue"  # The host name
    scheme: Literal["redis", "rediss"] = "redis"  # The scheme used
    port: int = 6379  # Port number
    path: str = "/0"  # Path in the Redis
    password: SecretStr = SecretStr("")  # The password for accessing Redis
    ttl: int = 3600  # Time-to-live in seconds
    use_cluster: bool = False  # Indicates if a Redis cluster is used

    @property
    def url(self) -> RedisDsn:
        """
        Constructs a Redis URL using the host, scheme, port, and path.
        Returns:
            A string, the constructed URL.
        """
        return RedisDsn.build(
            host=self.host,
            scheme=self.scheme,
            port=self.port,
            path=self.path,
        )


class Config(BaseSettings):
    """
    This class groups all the different configurations together for the application agent.
    """

    redis: RedisConfig = RedisConfig()
    data_path: Path = Path("/app/data")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"

    # sql_db: PostgresConfig = PostgresConfig()


CONFIG = Config()

"""
Different kind of configurations that can be imported from the module.
"""
__all__ = ["Config", "RedisConfig", "CONFIG"]

"""
Bruno Abilities - Agent capabilities and tool usage
"""
from typing import Dict, List, Optional, Any, Callable
import logging
import inspect

logger = logging.getLogger(__name__)


class Ability:
    """Base class for agent abilities/tools."""
    
    def __init__(
        self,
        name: str,
        description: str,
        function: Callable,
        parameters: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize an ability.
        
        Args:
            name: Name of the ability
            description: Description of what the ability does
            function: The function to execute
            parameters: JSON schema describing parameters
        """
        self.name = name
        self.description = description
        self.function = function
        self.parameters = parameters or {}
    
    async def execute(self, **kwargs) -> Any:
        """Execute the ability with given parameters."""
        try:
            if inspect.iscoroutinefunction(self.function):
                result = await self.function(**kwargs)
            else:
                result = self.function(**kwargs)
            
            logger.info(f"Executed ability '{self.name}' successfully")
            return result
        except Exception as e:
            logger.error(f"Error executing ability '{self.name}': {str(e)}", exc_info=True)
            raise
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ability to dictionary format."""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }


class AbilityManager:
    """Manages agent abilities and tool usage."""
    
    def __init__(self):
        """Initialize ability manager."""
        self.abilities: Dict[str, Ability] = {}
        logger.info("Initialized AbilityManager")
    
    def register_ability(self, ability: Ability) -> None:
        """
        Register a new ability.
        
        Args:
            ability: Ability instance to register
        """
        self.abilities[ability.name] = ability
        logger.info(f"Registered ability: {ability.name}")
    
    def register_function(
        self,
        name: str,
        description: str,
        function: Callable,
        parameters: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Register a function as an ability.
        
        Args:
            name: Name of the ability
            description: Description of what it does
            function: The function to execute
            parameters: JSON schema for parameters
        """
        ability = Ability(name, description, function, parameters)
        self.register_ability(ability)
    
    async def execute_ability(
        self,
        ability_name: str,
        **kwargs
    ) -> Any:
        """
        Execute an ability by name.
        
        Args:
            ability_name: Name of the ability to execute
            **kwargs: Parameters to pass to the ability
            
        Returns:
            Result of the ability execution
        """
        if ability_name not in self.abilities:
            raise ValueError(f"Ability '{ability_name}' not found")
        
        ability = self.abilities[ability_name]
        return await ability.execute(**kwargs)
    
    def get_abilities_schema(self) -> List[Dict[str, Any]]:
        """Get schema of all registered abilities."""
        return [ability.to_dict() for ability in self.abilities.values()]
    
    def list_abilities(self) -> List[str]:
        """List names of all registered abilities."""
        return list(self.abilities.keys())
    
    def get_ability(self, name: str) -> Optional[Ability]:
        """Get an ability by name."""
        return self.abilities.get(name)


# Built-in abilities
def search_web(query: str) -> str:
    """Search the web for information (placeholder)."""
    logger.info(f"Web search requested: {query}")
    return f"Search results for '{query}' would appear here. (Not implemented yet)"


def get_current_time() -> str:
    """Get the current time."""
    from datetime import datetime
    now = datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")


def calculate(expression: str) -> str:
    """Safely evaluate a mathematical expression."""
    try:
        # Only allow safe mathematical operations
        allowed_chars = set("0123456789+-*/(). ")
        if not all(c in allowed_chars for c in expression):
            return "Error: Invalid characters in expression"
        
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"Error calculating: {str(e)}"


def create_default_abilities() -> AbilityManager:
    """Create an ability manager with default abilities."""
    manager = AbilityManager()
    
    # Register built-in abilities
    manager.register_function(
        name="get_current_time",
        description="Get the current date and time",
        function=get_current_time,
        parameters={}
    )
    
    manager.register_function(
        name="calculate",
        description="Calculate a mathematical expression",
        function=calculate,
        parameters={
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Mathematical expression to evaluate"
                }
            },
            "required": ["expression"]
        }
    )
    
    manager.register_function(
        name="search_web",
        description="Search the web for information",
        function=search_web,
        parameters={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query"
                }
            },
            "required": ["query"]
        }
    )
    
    return manager
